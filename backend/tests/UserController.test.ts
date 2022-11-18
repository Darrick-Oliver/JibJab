import { UserController } from '../controllers/UserController';
import { bootstrapDB } from '../bootstrap/db_init';
import mongoose from 'mongoose';

const uc = new UserController();
jest.setTimeout(10000);

beforeAll(async () => {
    await mongoose.disconnect();
    await bootstrapDB();
});

afterAll(async () => {
    await mongoose.disconnect();
    console.log('MongDB disconnected');
});

test('userController - login', async () => {
    const email = 'asdf';
    const password = 'asdfasdfasdf';
    const result = await uc.login(email, password);
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
    const email = 'asdf';
    const password = 'wrongPass';
    try {
        const result = await uc.login(email, password);
    } catch (err: any) {
        expect(err.error).toBe(true);
    }
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


//requires deletion of user in database everytime to pass
/*
test('userController - register - success', async () => {
    const username = 'test';
    const first_name = 'tester';
    const last_name = 'testerson';
    const email = 'test123';
    const password = 'asdfasdf1234';
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
*/
