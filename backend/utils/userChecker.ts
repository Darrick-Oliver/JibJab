import { Action } from 'routing-controllers';
import { JwtPayload, verify } from 'jsonwebtoken';
import User from '../models/User';
import 'dotenv/config';
import { errorMessage } from './returns';

export const userChecker = async (action: Action) => {
    const accessToken = action.request.headers['accesstoken'];

    try {
        var jwtContent = verify(
            accessToken,
            process.env.JWT_SECRET as string
        ) as JwtPayload;
        const username = jwtContent.username;

        const user = await User.findOne({ username: username }).lean();
        if (!user) {
            throw errorMessage('Invalid user token');
        }

        return user;
    } catch (err) {
        throw errorMessage('Invalid user token');
    }
};
