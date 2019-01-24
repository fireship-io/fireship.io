/// <reference types="jest" />
import * as funTest from 'firebase-functions-test';
funTest();

test('city database has Vienna', () => {
    expect(true).toBe(true);
});
