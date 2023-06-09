import {
    BodyParam,
    Delete,
    Get,
    HttpCode,
    JsonController,
    Param,
    Post,
} from 'routing-controllers';
import 'dotenv/config';
import { CurrentUser } from 'routing-controllers';
import { IGroupChat } from '../models/GroupChat';
import GroupChat from '../models/GroupChat';
import { errorMessage, successMessage } from '../utils/returns';
import Chat from '../models/Chat';

const MAX_DISTANCE = 300;
const MAX_TAKE = 50;

const min = (a: number, b: number) => {
    return a > b ? b : a;
};

@JsonController()
export class ChatController {
    @HttpCode(201)
    @Post('/group/create')
    async create(
        @BodyParam('title', { required: true }) title: string,
        @BodyParam('description', { required: true }) description: string,
        @BodyParam('latitude', { required: true }) latitude: number,
        @BodyParam('longitude', { required: true }) longitude: number,
        @CurrentUser({ required: true }) user: any
    ) {
        const groupData: IGroupChat = {
            creator: user._id,
            title: title,
            description: description,
            lastPost: new Date(),
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        };

        const group = new GroupChat(groupData);
        try {
            await group.save();
            return successMessage(groupData);
        } catch (err) {
            throw handleError(err);
        }
    }

    @HttpCode(200)
    @Post('/group/delete')
    async delete(
        @BodyParam('id', { required: true }) _id: string,
        @CurrentUser({ required: true }) user: any
    ) {
        // Ensure user is owner of group
        const group = await GroupChat.findOne({ _id }).lean();
        if (!group) {
            throw errorMessage(`Couldn't find group with id ${_id}`);
        }
        if (group.creator !== user._id) {
            throw errorMessage(
                `User ${user.username} is not the owner of this group`
            );
        }

        // Destroy all messages
        await Chat.deleteMany({ group: group._id }, (err) => {
            if (err) {
                throw handleError(err);
            }
        });

        // Destroy group
        await GroupChat.findByIdAndDelete(group._id);

        return successMessage('Successfully deleted group');
    }

    @HttpCode(200)
    @Post('/chat/get')
    async getChats(
        @BodyParam('group', { required: true }) groupId: string,
        @BodyParam('take', { required: true }) take: number,
        @BodyParam('page', { required: true }) page: number,
        @BodyParam('latitude', { required: true }) latitude: number,
        @BodyParam('longitude', { required: true }) longitude: number,
        @BodyParam('distance', { required: true }) distance: number,
        @CurrentUser({ required: true }) _: any
    ) {
        // Find group within range
        const groups = await GroupChat.findOne({
            _id: groupId,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: min(MAX_DISTANCE, distance) * 1609.344, // Convert to meters
                },
            },
        }).lean();

        if (!groups) {
            throw errorMessage('Group not found');
        }

        // Get most recent chats
        const chats = await Chat.find(
            {
                group: groupId,
            }
        )
        .populate('user', { username: 1, first_name: 1, last_name: 1 })
        .sort({ createdOn: 'asc' })
        .skip(page * Math.min(MAX_TAKE, take))
        .limit(Math.min(MAX_TAKE, take));

        return successMessage(chats);
    }

    @HttpCode(200)
    @Post('/group/get')
    async getGroups(
        @BodyParam('take', { required: true }) take: number,
        @BodyParam('page', { required: true }) page: number,
        @BodyParam('latitude', { required: true }) latitude: number,
        @BodyParam('longitude', { required: true }) longitude: number,
        @BodyParam('distance', { required: true }) distance: number,
        @CurrentUser({ required: true }) _: any
    ) {
        // Find groups within range
        const groups = await GroupChat.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: min(MAX_DISTANCE, distance) * 1609.344, // Convert to meters
                },
            },
        })
            .populate('creator', { username: 1, first_name: 1, last_name: 1 })
            .sort({
                lastPost: -1
            })
            .skip(page * Math.min(MAX_TAKE, take))
            .limit(Math.min(MAX_TAKE, take))
            .select({
                _id: 1,
                creator: 1,
                title: 1,
                description: 1,
                lastPost: 1,
            });

        if (!groups) {
            throw errorMessage('No groups found');
        }

        return successMessage(groups);
    }
}

const handleError = (err: string | Error | NativeError | unknown) => {
    if (typeof err === 'string') {
        return errorMessage(err);
    } else if (err instanceof Error) {
        return errorMessage(err.message);
    } else {
        return errorMessage('Unknown error');
    }
};
