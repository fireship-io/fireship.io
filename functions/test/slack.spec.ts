/// <reference types="jest" />
import * as funTest from 'firebase-functions-test';
funTest();

test('true to be true', () => {
    expect(true).toBe(true);
});
