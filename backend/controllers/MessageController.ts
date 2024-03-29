import {
    BodyParam,
    Delete,
    Get,
    HttpCode,
    JsonController,
    Param,
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
            numReactions: [0, 0, 0, 0, 0, 0, 0, 0],
        };

        const m = new Message(messageInfo);
        try {
            await m.save();
            return successMessage({
                _id: m._id,
                user: {
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                time: m.time,
                message: m.message,
                reactions: m.reactions,
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
        @BodyParam('reaction') reactionIndex: number,
        @BodyParam('increment') increment: boolean
    ) {
        if (
            !messageid ||
            reactionIndex === undefined ||
            increment === undefined
        )
            throw errorMessage('Cannot include null values');

        const reactionArray: any = await Message.findById(
            messageid,
            'reactions numReactions'
        ).lean();
        if (!reactionArray) throw errorMessage('Message not found');

        if (increment) {
            if (
                !reactionArray.reactions[reactionIndex].includes(user.username)
            ) {
                reactionArray.reactions[reactionIndex].push(user.username);
                reactionArray.numReactions[reactionIndex] =
                    Number(reactionArray.numReactions[reactionIndex]) + 1;
            } else throw errorMessage('Repeat Reaction');
        } else {
            //decrement
            if (
                reactionArray.reactions[reactionIndex].includes(user.username)
            ) {
                const idx = reactionArray.reactions[reactionIndex].indexOf(
                    user.username
                );
                reactionArray.reactions[reactionIndex].splice(idx, 1);
                reactionArray.numReactions[reactionIndex] =
                    Number(reactionArray.numReactions[reactionIndex]) - 1;
            } else
                throw errorMessage('You have not reacted with this reaction');
        }

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

        if (!messages || !messages.length) {
            return successMessage([]);
        }

        for (let m = 0; m < messages.length; m++) {
            let userReactions: boolean[] = [];

            // Add all of user's reactions to an array
            for (let i = 0; i < 8; i++) {
                if (messages[m].reactions[i].includes(user.username)) {
                    userReactions.push(true);
                } else {
                    userReactions.push(false);
                }
            }

            // Don't let users see who else reacted
            messages[m].reactions = userReactions;
        }

        return successMessage(messages);
    }

    @HttpCode(202)
    @Delete('/message/delete/:id')
    async delete(@CurrentUser() user: any, @Param('id') id: string) {
        if (!id) throw errorMessage('Cannot include null values');

        const message = await Message.findById(id).lean().select({
            user: 1,
            message: 1,
            time: 1,
            reactions: 1,
            numReactions: 1,
        });
        if (!message) throw errorMessage("Message doesn't exist");
        if (message.user.toString() !== user._id.toString())
            throw errorMessage("You cannot delete other people's jabs");

        const res = await Message.findByIdAndDelete(id);

        if (res) return successMessage();
        else throw errorMessage('Unexpected error deleting message');
    }
}
