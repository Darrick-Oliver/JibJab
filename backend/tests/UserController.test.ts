import { UserController } from '../controllers/UserController';
import { bootstrapDB } from '../bootstrap/db_init';
const mongoose = require('mongoose')
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'dotenv/config';

const uc = new UserController();
jest.setTimeout(10000);

let mongod: MongoMemoryServer;
let conn: MongoClient;

beforeAll(async () => {
    //await mongoose.disconnect();
    //await bootstrapDB();

    const mongod = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongod.getUri(), {});
});

afterAll(async () => {
    //await mongoose.disconnect();
    //console.log('MongDB disconnected');
    await mongoose.disconnect();
    if (mongod){
        await mongod.stop();
    }
});

test('simple test', async () => {
    const email = 'asdf';
    const password = 'asdfasdfasdf';
    expect(5).toBe(5);
});

//Register User Tests

test('userController - register - fail - null fields', async () => {
    const username = '';
    const first_name = '';
    const last_name = '';
    const email = '';
    const password = '';
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
    const result = await uc.register(
            username,
            first_name,
            last_name,
            email,
            password);
    expect(result.error).toBe(false);
});

test('userController - login fail', async () => {
    const email = 'failedEmail';
    const password = 'asdfasdfasdf';
    try {
        const result = await uc.login(email, password);
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - login fail - wrong pass', async () => {
    const email = 'helloFresh';
    const password = 'wrongPass';
    try {
        const result = await uc.login(email, password);
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});

test('userController - login', async () => {
    const email = 'helloFresh';
    const password = 'thisPasswordWorks';
    const result = await uc.login(email, password);
    expect(result.error).toBe(false);
});

