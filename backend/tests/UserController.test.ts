import { UserController } from '../controllers/UserController';
import { bootstrapDB } from '../bootstrap/db_init';
const mongoose = require('mongoose');
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'dotenv/config';

const uc = new UserController();
jest.setTimeout(10000);

let mongod: MongoMemoryServer;
let conn: MongoClient;

//connect to database
beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongod.getUri(), {});
});

//disconnect from database
afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) {
        await mongod.stop();
    }
});

//Register User Tests
test('userController - register - fail - null fields', async () => {
    const username = '';
    const first_name = '';
    const last_name = '';
    const email = '';
    const password = '';

    //register user
    try {
        const result = await uc.register(
            username,
            first_name,
            last_name,
            email,
            password
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - register - fail - short password', async () => {
    const username = '$trawberry';
    const first_name = 'John';
    const last_name = 'Travolta';
    const email = 'helloFresh';
    const password = 'less8';

    //register user
    try {
        const result = await uc.register(
            username,
            first_name,
            last_name,
            email,
            password
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - register - fail - short username', async () => {
    const username = 'jo';
    const first_name = 'John';
    const last_name = 'Travolta';
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';

    //register user
    try {
        const result = await uc.register(
            username,
            first_name,
            last_name,
            email,
            password
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - register - success', async () => {
    const username = 'johnBoi';
    const first_name = 'John';
    const last_name = 'Travolta';
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';

    //register user
    const result = await uc.register(
        username,
        first_name,
        last_name,
        email,
        password
    );
    expect(result.error).toBe(false);
});

test('userController - login fail', async () => {
    const email = 'failedEmail';
    const password = 'asdfasdfasdf';

    //try login
    try {
        const result = await uc.login(email, password);
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - login fail - wrong pass', async () => {
    const email = 'helloFresh';
    const password = 'wrongPass';

    //try login
    try {
        const result = await uc.login(email, password);
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - login - success', async () => {
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';

    //try login
    const result = await uc.login(email, password);
    expect(result.error).toBe(false);
});
