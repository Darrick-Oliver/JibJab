import { MessageController } from '../controllers/MessageController';
import { UserController } from '../controllers/UserController';
const mongoose = require('mongoose');
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'dotenv/config';
import { userChecker } from '../utils/userChecker';
import { Action } from 'routing-controllers';
import User from '../models/User';
import Message, { IMessage } from '../models/Message';

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

const USERNAME2 = 'luki';
const FIRST_NAME2 = 'Luc';
const LAST_NAME2 = 'Williams';
const EMAIL2 = 'testEmail';
const PASSWORD2 = 'longEnoughPassword';

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

    await uc.register(USERNAME, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD);

    await uc.register(USERNAME2, FIRST_NAME2, LAST_NAME2, EMAIL2, PASSWORD2);
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
    const latitude = 51;
    const longitude = 16;
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

test('Test - get message - success', async () => {
    const reactionIndex = 0;
    const increment = true;
    const message = 'newMessage';
    const latitude = 51;
    const longitude = 16;
    const distance = 5;
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

    const messageRet = await mc.create(
        message,
        latitude,
        longitude,
        await currentUser(access_token)
    );

    //react to message
    await mc.react(
        await currentUser(access_token),
        messageRet.data._id,
        reactionIndex,
        increment
    );

    //get message with reactions
    const result = await mc.get(
        await currentUser(access_token),
        latitude,
        longitude,
        distance
    );

    expect(result.data).not.toEqual([]);
    expect(result.data).not.toEqual({});
    expect(result.data).not.toBe(undefined);
    expect(result.error).toBe(false);
});

test('Test - get message - failure - null fields', async () => {
    const message = 'Hello';
    const latitude = 51;
    const longitude = 80;
    const distance = 0;
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

    //get message
    try {
        const result = await mc.get(
            await currentUser(access_token),
            latitude,
            longitude,
            distance
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('Test - get message - failure - no messages', async () => {
    const message = 'Hello';
    const latitude = 2;
    const longitude = 3;
    const distance = 1;
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

    //get message
    try {
        const result = await mc.get(
            await currentUser(access_token),
            latitude,
            longitude,
            distance
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('Test - message react - all cases', async () => {
    const reactionIndex = 0;
    const increment = true;
    const decrement = false;
    const message = 'hello';
    const latitude = 51;
    const longitude = 50;
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
    const messageRet = await mc.create(
        message,
        latitude,
        longitude,
        await currentUser(access_token)
    );

    //react increment
    const result = await mc.react(
        await currentUser(access_token),
        messageRet.data._id,
        reactionIndex,
        increment
    );

    expect(result.error).toBe(false);

    //increment again failure
    try {
        await mc.react(
            await currentUser(access_token),
            messageRet.data._id,
            reactionIndex,
            increment
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }

    //decrement success
    const result2 = await mc.react(
        await currentUser(access_token),
        messageRet.data._id,
        reactionIndex,
        decrement
    );

    expect(result2.error).toBe(false);

    //decrement twice failure
    try {
        const result3 = await mc.react(
            await currentUser(access_token),
            messageRet.data._id,
            reactionIndex,
            decrement
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }

    //decrement with false id check null fields
    try {
        const result3 = await mc.react(
            await currentUser(access_token),
            messageRet._id,
            reactionIndex,
            decrement
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('Test - message delete - success', async () => {
    const reactionIndex = 0;
    const increment = true;
    const message = 'coolMessage';
    const message2 = 'wowMessage';
    const latitude = 51;
    const longitude = 50;
    let access_token = null;
    let access_token2 = null;

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

    const data2 = (await uc.login(EMAIL2, PASSWORD2))?.data;
    if (data2 instanceof Object) {
        (Object.keys(data2) as (keyof typeof data2)[]).find((key) => {
            access_token2 = data2[key];
        });
    }

    if (!access_token2) {
        fail('no access_token for login');
    }

    //create test message
    const messageRet = await mc.create(
        message,
        latitude,
        longitude,
        await currentUser(access_token)
    );

    //create test message by diff user
    const messageRet2 = await mc.create(
        message,
        latitude,
        longitude,
        await currentUser(access_token2)
    );

    //delete message
    const result = await mc.delete(
        await currentUser(access_token),
        messageRet.data._id
    );

    expect(result.error).toBe(false);

    //try to delete other users message
    try {
        const resultNew = await mc.delete(
            await currentUser(access_token),
            messageRet2.data._id
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});
