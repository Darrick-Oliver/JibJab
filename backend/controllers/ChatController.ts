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
export class ChatController {
    @HttpCode(201)
    @Post('/chat/create')
    async create(
        @BodyParam('title') title: string,
        @BodyParam('description') description: string,
        @BodyParam('latitude') latitude: number,
        @BodyParam('longitude') longitude: number,
        @CurrentUser() user: any
    ) {
        // if (!message || !latitude || !longitude) {
        //     throw errorMessage('Cannot include null values');
        // }
        // if (message.length > 281) {
        //     throw errorMessage('Message must be at most 281 characters');
        // }

        // const messageInfo: IMessage = {
        //     user: user._id,
        //     message: message,
        //     time: new Date(),
        //     location: {
        //         type: 'Point',
        //         coordinates: [longitude, latitude],
        //     },
        //     reactions: [[], [], [], [], [], [], [], []],
        //     numReactions: [0, 0, 0, 0, 0, 0, 0, 0],
        // };

        // const m = new Message(messageInfo);
        // try {
        //     await m.save();
        //     return successMessage({
        //         _id: m._id,
        //         user: {
        //             username: user.username,
        //             first_name: user.first_name,
        //             last_name: user.last_name,
        //         },
        //         time: m.time,
        //         message: m.message,
        //         reactions: m.reactions,
        //         numReactions: m.numReactions,
        //     });
        // } catch (err) {
        //     if (typeof err === 'string') {
        //         throw errorMessage(err);
        //     } else if (err instanceof Error) {
        //         throw errorMessage(err.message);
        //     } else {
        //         throw errorMessage('Unknown error');
        //     }
        // }
    }

}
