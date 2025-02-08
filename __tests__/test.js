// @ts-check

import { promises as fs } from 'fs';
import path from 'path';
import app from '../src/application.js';

beforeEach(async () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  const html = await fs.readFile(pathToHtml, 'utf8');
  document.body.innerHTML = html;
});

test('app', () => {
  app();
  expect(true).toBeDefined();
});
