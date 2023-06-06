import mongoose, { Schema, model } from 'mongoose';

export interface IChat {
    group: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    message: string;
    createdOn: Date;
}

const ChatSchema: Schema = new Schema<IChat>({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'GroupChat',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxLength: 280,
    },
    createdOn: { type: Date, required: true },
});
ChatSchema.index({ location: '2dsphere' });

export default model<IChat>('Chat', ChatSchema);
