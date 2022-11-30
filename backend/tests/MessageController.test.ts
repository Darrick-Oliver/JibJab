import { MessageController } from '../controllers/MessageController';
import { UserController } from '../controllers/UserController';
const mongoose = require('mongoose');
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'dotenv/config';
import { userChecker } from '../utils/userChecker';
import { Action } from 'routing-controllers';

const mc = new MessageController();
const uc = new UserController();
jest.setTimeout(10000);

let mongod: MongoMemoryServer;
let conn: MongoClient;

const USERNAME = 'johnBoi';
const FIRST_NAME = 'John';
const LAST_NAME = 'Travolta';
const EMAIL = 'helloFresh';
const PASSWORD = 'thisPasswordWorks';

//helper function to retrieve access_token from header
const currentUser = (access_token: string) => {
    const action: Action = {
        request: {
            headers: {
                accesstoken: access_token,
            },
        },
        response: {},
    };
    return userChecker(action);
};

//create database and register user for testing
beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongod.getUri(), {});

    const result = await uc.register(
        USERNAME,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        PASSWORD
    );
});

//disconnect from database
afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) {
        await mongod.stop();
    }
});

test('Test - Send Message - fail - null values', async () => {
    const message = '';
    const latitude = 0;
    const longitude = 0;
    let access_token = null;

    //get current user by login
    const data = (await uc.login(EMAIL, PASSWORD))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    //create message
    try {
        const result = await mc.create(
            message,
            latitude,
            longitude,
            await currentUser(access_token)
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('Test - Send Message - fail - message length', async () => {
    const message =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const latitude = 5;
    const longitude = 10;
    let access_token = null;

    //get current user by login
    const data = (await uc.login(EMAIL, PASSWORD))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    //create message
    try {
        const result = await mc.create(
            message,
            latitude,
            longitude,
            await currentUser(access_token)
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('Test - Send Message - success', async () => {
    const message = 'Hello';
    const latitude = 50;
    const longitude = 100;
    let access_token = null;

    //get current user by login
    const data = (await uc.login(EMAIL, PASSWORD))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    //create message
    const result = await mc.create(
        message,
        latitude,
        longitude,
        await currentUser(access_token)
    );

    expect(result.error).toBe(false);
});
