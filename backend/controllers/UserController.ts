import { BodyParam, Get, HttpCode, JsonController, Post, Req, Res } from "routing-controllers";
import User, { IUser } from '../models/User';
import { successMessage, errorMessage } from '../utils/returns';

@JsonController()
export class UserController {
    @HttpCode(201)
    @Post('/account/register')   
    async register (
        @BodyParam('username') username: string,
        @BodyParam('first_name') first_name: string,
        @BodyParam('last_name') last_name: string,
        @BodyParam('email') email: string,
        @BodyParam('password') password: string,
        @BodyParam('email') email: string,
    ) {
        // TODO: Add username, firstname, lastname, password checks. Generate jwt
        if (!username || !first_name || !last_name || !email || !password) {
            return errorMessage('');
        }

        const userInfo: IUser = {
            username: username,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            email: email,
            joined: new Date(),
            access_token: 'test'
        };

        const user = new User(userInfo);
        try {
            await user.save();
            return successMessage({
                access_token: userInfo.access_token
            });
        }
        catch (err) {
            if (typeof err === 'string') {
                return errorMessage(err);
            } else if (err instanceof Error) {
                return errorMessage(err.message);
            } else {
                return errorMessage('Unknown error');
            }
        }
    }
}