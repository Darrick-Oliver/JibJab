import { UserController } from '../controllers/UserController';
import { bootstrapDB } from '../bootstrap/db_init';
const mongoose = require('mongoose');
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { userChecker } from '../utils/userChecker';
import { Action, Param } from 'routing-controllers';
import 'dotenv/config';
import User, { IUser } from '../models/User';

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

test('userController - get ID - failure', async () => {
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';
    const username = 'notAUsername';
    let access_token = null;

    //get current user by login
    const data = (await uc.login(email, password))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    const user = await User.findOne({ email: 'helloFresh' });

    if (!user) {
        fail('user not in database');
    }

    //try getting account by false username
    try {
        const result = await uc.accountGet(
            await currentUser(access_token),
            username
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - get ID - success', async () => {
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';
    const username = 'johnBoi';
    let access_token = null;

    //get current user by login
    const data = (await uc.login(email, password))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    //try getting user by ID
    const result = await uc.accountGet(
        await currentUser(access_token),
        username
    );

    expect(result.error).toBe(false);
});

test('userController - update bio - success', async () => {
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';
    let access_token = null;

    //get current user by login
    const data = (await uc.login(email, password))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    //try updating bio
    const result = await uc.updateBio(
        await currentUser(access_token),
        'Hello welcome to my page'
    );
    expect(result.error).toBe(false);
});

test('userController - update bio - failure', async () => {
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';
    let access_token = null;

    //get current user by login
    const data = (await uc.login(email, password))?.data;
    if (data instanceof Object) {
        (Object.keys(data) as (keyof typeof data)[]).find((key) => {
            access_token = data[key];
        });
    }

    if (!access_token) {
        fail('no access_token for login');
    }

    //try updating bio
    try {
        const result = await uc.updateBio(
            await currentUser(access_token),
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        );
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});
