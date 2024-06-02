import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  // remove all data from the database

  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {} // ignore error
});
