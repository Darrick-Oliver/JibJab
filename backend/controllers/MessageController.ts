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
            throw errorMessage('Message must be less than 281 characters');
        }

        const messageInfo: IMessage = {
            username: user.username,
            message: message,
            time: new Date(),
            location: `${latitude}, ${longitude}`,
        };

        const m = new Message(messageInfo);
        try {
            await m.save();
            return successMessage({ id: m._id, username: m.username, time: m.time, message: m.message });
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
    @Get('/message/getAll')
    async getAll(@CurrentUser() user: any) {
        const messages = await Message.find({}).lean().select({
            _id: 1,
            username: 1,
            message: 1,
            time: 1,
        });
        if (!messages) {
            throw errorMessage('GetAll error');
        }
        return successMessage(messages);
    }
}
