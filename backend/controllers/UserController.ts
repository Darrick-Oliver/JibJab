import { BodyParam, Get, HttpCode, JsonController, Post, Req, Res } from "routing-controllers";
import User, { IUser } from '../models/User'

@JsonController()
export class AccountController {
    @HttpCode(201)
    @Post('/account/register')   
    async register (
        @BodyParam('username') username: string,
        @BodyParam('first_name') first_name: string,
        @BodyParam('last_name') last_name: string,
        @BodyParam('password') password: string,
    ) {
        const userInfo: IUser = {
            username: username,
            first_name: first_name,
            last_name: last_name,
            password: password,
            joined: new Date(),
            access_token: 'test'
        };

        const user = new User(userInfo);

        await user.save();
        return "Success"
    }
}