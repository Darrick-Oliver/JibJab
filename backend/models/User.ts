import { Schema, model } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

export interface IUser {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    joined: Date;
    bio?: string;
    password: string;
    access_token: string;
}

const UserSchema: Schema = new Schema<IUser>({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    username: {
        type: String,
        required: true,
        maxLength: 40,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    email: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    joined: { type: Date, required: true },
    bio: { type: String, required: false, maxLength: 240 },
    password: { type: String, required: true },
    access_token: { type: String, required: true },
});

UserSchema.plugin(uniqueValidator, {
    message: 'Error, {PATH} must be unique.',
});

export default model<IUser>('User', UserSchema);
