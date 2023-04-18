import {
    Body,
    BodyParam,
    CurrentUser,
    Get,
    HttpCode,
    JsonController,
    Param,
    Post,
} from 'routing-controllers';
import User, { IUser } from '../models/User';
import { successMessage, errorMessage } from '../utils/returns';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Message from '../models/Message';

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
    @Post('/account/available/')
    async available(
        @BodyParam('username') username?: string,
        @BodyParam('email') email?: string
    ) {
        if (!username && !email) {
            throw errorMessage('Must include a username or email');
        }

        let taken: any = {};
        if (username) {
            const user = await User.findOne({
                username: { $regex: new RegExp(`\\b${username}\\b`, 'i') },
            }).lean();
            taken.username = user ? false : true;
        }
        if (email) {
            const user = await User.findOne({
                email: { $regex: new RegExp(`\\b${email}\\b`, 'i') },
            }).lean();
            taken.email = user ? false : true;
        }
        return successMessage(taken);
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
        return successMessage({ access_token: token });
    }

    @HttpCode(200)
    @Get('/account/:id')
    async accountGet(@CurrentUser() currUser: any, @Param('id') id: string) {
        const user = await User.findOne({
            username: { $regex: new RegExp(`\\b${id}\\b`, 'i') },
        })
            .lean()
            .select('username first_name last_name joined bio');
        if (!user) {
            throw errorMessage('User does not exist');
        }

        return successMessage(user);
    }

    @HttpCode(200)
    @Post('/account/update/bio')
    async updateBio(@CurrentUser() user: any, @BodyParam('bio') bio: string) {
        if (bio.length > 240)
            throw errorMessage('Bio cannot be longer than 240 characters');

        await User.updateOne(
            {
                _id: user._id,
            },
            { bio: bio }
        );

        return successMessage();
    }

    @HttpCode(200)
    @Get('/account/messages/:id')
    async getUserMessages(
        @CurrentUser() currUser: any,
        @Param('id') id: string
    ) {
        const user = await User.findOne({
            username: { $regex: new RegExp(`\\b${id}\\b`, 'i') },
        })
            .lean()
            .select('username first_name last_name joined bio');

        if (!user) {
            throw errorMessage('User does not exist');
        }

        const messages: any = await Message.find({
            user: user._id,
        })
            .populate('user', { username: 1, first_name: 1, last_name: 1 })
            .lean()
            .select({
                user: 1,
                message: 1,
                time: 1,
                reactions: 1,
                numReactions: 1,
            });

        if (!messages || !messages.length) {
            return successMessage([]);
        }

        for (let m = 0; m < messages.length; m++) {
            let userReactions: boolean[] = [];

            // Add all of user's reactions to an array
            for (let i = 0; i < 8; i++) {
                if (messages[m].reactions[i].includes(currUser.username)) {
                    userReactions.push(true);
                } else {
                    userReactions.push(false);
                }
            }

            // Don't let users see who else reacted
            messages[m].reactions = userReactions;
        }

        return successMessage(messages);
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
