import { Schema, model, ObjectId } from 'mongoose';

export interface IGroupChat {
    creator: ObjectId;
    title: string;
    description: string;
    last_post: Date;
    location: ILoc;
}

interface ILoc {
    type: 'Point';
    coordinates: [number, number];
}

const GroupChatSchema: Schema = new Schema<IGroupChat>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        maxLength: 280
    },
    last_post: { 
        type: Date,
        required: true 
    },
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
    }
});
GroupChatSchema.index({ location: '2dsphere' });

export default model<IGroupChat>('GroupChat', GroupChatSchema);
