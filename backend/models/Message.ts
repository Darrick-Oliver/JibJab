import { Schema, model } from 'mongoose';
import { IUser } from './User';

export interface IMessage {
    user: IUser;
    message: string;
    time: Date;
    location: ILoc;
    reactions: Array<Array<String>>;
    numReactions: Array<Number>;
}

interface ILoc {
    type: 'Point';
    coordinates: [number, number];
}

const MessageSchema: Schema = new Schema<IMessage>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxLength: 281,
    },
    time: { type: Date, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    reactions: {
        type: [[String]],
        required: true
    },
    numReactions: {
        type: [Number],
        required: true
    }

});
MessageSchema.index({ location: '2dsphere' });

export default model<IMessage>('Message', MessageSchema);
