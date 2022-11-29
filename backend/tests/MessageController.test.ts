import { MessageController } from '../controllers/MessageController';
import { bootstrapDB } from '../bootstrap/db_init';
const mongoose = require('mongoose')
import { CurrentUser } from 'routing-controllers';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'dotenv/config';

const mc = new MessageController();
jest.setTimeout(10000);

let mongod: MongoMemoryServer;
let conn: MongoClient;

beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongod.getUri(), {});
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongod){
        await mongod.stop();
    }
});

test('Test - Send Message - fail', async () => {
    const email = 'asdf';
    const password = 'asdfasdfasdf';

    try {
        const result = await mc.create('test', 5, 5, CurrentUser());
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
});
