import { connectDatabase, disconnectDatabase } from '../src/config/database';

jest.setTimeout(30000); // 20 seconds

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await disconnectDatabase();
}); 