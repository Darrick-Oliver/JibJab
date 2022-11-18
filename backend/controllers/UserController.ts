import {
    Body,
    BodyParam,
    Get,
    HttpCode,
    JsonController,
    Post,
} from 'routing-controllers';
import User, { IUser } from '../models/User';
import { successMessage, errorMessage } from '../utils/returns';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

@JsonController()
export class UserController {
    @HttpCode(201)
    @Post('/account/register')
    async register(
        @BodyParam('username') username: string,
        @BodyParam('first_name') first_name: string,
        @BodyParam('last_name') last_name: string,
        @BodyParam('email') email: string,
        @BodyParam('password') password: string
    ) {
        if (!username || !first_name || !last_name || !email || !password) {
            throw errorMessage('Cannot include null values');
        }
        if (password.length <= 8) {
            throw errorMessage('Password must be longer than 8 characters');
        }
        if (username.length <= 3) {
            throw errorMessage('Username must be longer than 3 characters');
        }

        const hash = await hashPassword(password);
        const token = sign(
            { username: username, email: email },
            process.env.JWT_SECRET!
        );
        const userInfo: IUser = {
            username: username,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hash,
            joined: new Date(),
            access_token: token,
        };

        const u = new User(userInfo);
        try {
            await u.save();
            return successMessage({
                access_token: userInfo.access_token,
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

    @HttpCode(200)
    @Post('/account/login')
    async login(
        @BodyParam('email') email: string,
        @BodyParam('password') password: string
    ) {
        // search for user on email in db
        const user = await User.findOne({ email: email }).lean();
        if (!user) {
            throw errorMessage('Email or password is incorrect');
        }

        // comparing user inputted password to db stored (hashed) password
        const access = await bcrypt.compare(password, user.password);
        if (!access) {
            throw errorMessage('Email or password is incorrect');
        }

        // return jwt
        const token = sign(
            { username: user.username, email: user.email },
            process.env.JWT_SECRET as string
        );
        const succMsg = successMessage({ access_token: token });
        return succMsg;
    }
}

const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, async (err, result: string) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
