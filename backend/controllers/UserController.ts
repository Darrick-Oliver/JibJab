import { BodyParam, Get, JsonController, Post } from "routing-controllers";

@JsonController()
export class AccountController {
    @Get('/account/register')
    async register (
        @BodyParam('email') email: string,
        @BodyParam('username') username: string,
        @BodyParam('password') password: string
    ) {
    }
}