import { MessageController } from '../controllers/MessageController';
import { bootstrapDB } from '../bootstrap/db_init';
import mongoose from 'mongoose';
import { CurrentUser } from 'routing-controllers';

const mc = new MessageController();
jest.setTimeout(10000);

beforeAll(async () => {
    await mongoose.disconnect();
    await bootstrapDB();
});

afterAll(async () => {
    await mongoose.disconnect();
    console.log('MongDB disconnected');
});

test('Test - Send Message - fail', async () => {
    const email = 'asdf';
    const password = 'asdfasdfasdf';
    
    try{
      const result = await mc.create('test', 5, 5, CurrentUser());
    }
    catch(err: any){
      expect(err.error).toBe(true);
    }
});