/// <reference types="jest" />
import * as funTest from 'firebase-functions-test';
// import * as admin from 'firebase-admin';
funTest().mockConfig({ stripe: { testkey: 'sk_test_OPJq1i4HPWL0bjddnWR8Oj76' }});
import { getVal, getUID, createCustomer } from '../src/stripe/helpers';


test('getVal() should return a value or throw error', () => {
    const data = { sourceId: 'x' };
    expect(getVal(data, 'sourceId')).toEqual('x');
    expect(() => getVal(data, 'foo')).toThrow();
});

test('getUID() should return user ID or throw', () => {
    const context = { auth: { uid: 'x' } };
    expect(getUID(context)).toEqual('x');
    expect(() => getUID({ auth: null })).toThrow();
});

test.skip('createCustomer() create a new stripe customer', async () => {
    const user = { uid: 'xyz123', email: 'stripetest@fireship.io' };
    const cust = await createCustomer(user);
    console.log(cust)
    expect(cust.email).toEqual(user.email);
    expect(cust.id).toContain('cus_');
    expect(cust.metadata.firebaseUID).toEqual(user.uid);
});
