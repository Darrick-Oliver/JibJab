import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { bootstrapDB } from './bootstrap/db_init';
import { userChecker } from './utils/userChecker';

bootstrapDB();

export const app = createExpressServer({
    cors: true,
    controllers: [`${__dirname}/controllers/*.ts`], // we specify controllers we want to use
    routePrefix: '/api',
    currentUserChecker: userChecker,
});
