import 'reflect-metadata';
import { createExpressServer} from "routing-controllers";
import { bootstrapDB } from './bootstrap/db_init';

bootstrapDB();

export const app = createExpressServer({
	controllers: [`${__dirname}/controllers/*.ts`], // we specify controllers we want to use
	cors: true,
	routePrefix: '/api'
});