import {
    BodyParam,
    Get,
    HttpCode,
    JsonController,
    Post,
} from 'routing-controllers';
import Message, { IMessage } from '../models/Message';
import { successMessage, errorMessage } from '../utils/returns';
import 'dotenv/config';
import { CurrentUser } from 'routing-controllers';
import { ObjectId } from 'mongodb';

@JsonController()
export class MessageController {
    @HttpCode(201)
    @Post('/message/create')
    async create(
        @BodyParam('message') message: string,
        @BodyParam('latitude') latitude: number,
        @BodyParam('longitude') longitude: number,
        @CurrentUser() user: any
    ) {
        if (!message || !latitude || !longitude) {
            throw errorMessage('Cannot include null values');
        }
        if (message.length > 281) {
            throw errorMessage('Message must be at most 281 characters');
        }

        const messageInfo: IMessage = {
            user: user._id,
            message: message,
            time: new Date(),
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
            reactions: [[], [], [], [], [], [], [], []],
            numReactions: [1, 1, 1, 1, 1, 1, 1, 1],
        };

        const m = new Message(messageInfo);
        try {
            await m.save();
            return successMessage({
                id: m._id,
                user: {
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                time: m.time,
                message: m.message,
                numReactions: m.numReactions,
            });
        } catch (err) {
            if (typeof err === 'string') {
                throw errorMessage(err);
            } else if (err instanceof Error) {
                throw errorMessage(err.message);
            } else {
                throw errorMessage('Unknown error');
            }
        }
    }

    @HttpCode(201)
    @Post('/message/react')
    async react(
        @CurrentUser() user: any,
        @BodyParam('messageid') messageid: ObjectId,
        @BodyParam('reaction') reactionIndex: number
    ) {
        if (!messageid || reactionIndex === undefined)
            throw errorMessage('Cannot include null values');

        const reactionArray = await Message.findById(
            messageid,
            'reactions numReactions'
        ).lean();
        if (!reactionArray) throw errorMessage('Message not found');

        console.log('printing reactionarray numreactions');
        console.log(reactionArray);
        console.log(reactionArray.numReactions);

        if (!reactionArray.reactions[reactionIndex].includes(user.username)) {
            reactionArray.reactions[reactionIndex].push(user.username);
            reactionArray.numReactions[reactionIndex] =
                Number(reactionArray.numReactions[reactionIndex]) + 1;
        } else throw errorMessage('Repeat Reaction');

        try {
            await Message.findByIdAndUpdate(messageid, {
                reactions: reactionArray.reactions,
                numReactions: reactionArray.numReactions,
            });
            return successMessage();
        } catch (err) {
            if (typeof err === 'string') {
                throw errorMessage(err);
            } else if (err instanceof Error) {
                throw errorMessage(err.message);
            } else {
                throw errorMessage('Unknown error');
            }
        }
    }

    @HttpCode(200)
    @Post('/message/get')
    async get(
        @CurrentUser() user: any,
        @BodyParam('latitude') latitude: number,
        @BodyParam('longitude') longitude: number,
        @BodyParam('distance') distance: number
    ) {
        if (!latitude || !longitude || !distance)
            throw errorMessage('Cannot include null values');

        const messages: any = await Message.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: distance * 1609.344, // Convert to meters
                },
            },
        })
            .populate('user', { username: 1, first_name: 1, last_name: 1 })
            .lean()
            .select({
                user: 1,
                message: 1,
                time: 1,
                reactions: 1,
                numReactions: 1,
            });
        if (!messages) {
            throw errorMessage('No messages found');
        }
        //const userReactionCheck: any[][] = [];
        for (let m = 0; m < messages.length; m++) {
            let curr = [] as boolean[];
            for (let i = 0; i < 8; i++) {
                //console.log(messages[m]);
                if (messages[m].reactions[i].includes(user.username)) {
                    curr.push(true);
                } else {
                    curr.push(false);
                }
            }
            //delete messages[m].reactions;
            messages[m].reactions = curr;
        }
        //console.log('MESSAGES');
        //console.log(messages);
        return successMessage(messages);
    }
}
