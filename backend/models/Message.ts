import { Schema, model } from 'mongoose';

export interface IMessage {
    username: string;
    message: string;
    time: Date;
    location: string;
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
    location: { type: String },
});

export default model<IMessage>('MessageSchema', MessageSchema);
