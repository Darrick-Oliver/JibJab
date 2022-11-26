import { Schema, model } from 'mongoose';

export interface IMessage {
    username: string;
    message: string;
    time: Date;
    location: {};
}

const MessageSchema: Schema = new Schema<IMessage>({
    username: {
        type: String,
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
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});
MessageSchema.index({ location: '2dsphere' });

export default model<IMessage>('MessageSchema', MessageSchema);
