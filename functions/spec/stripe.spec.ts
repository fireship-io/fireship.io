/// <reference types="jest" />
import * as funTest from 'firebase-functions-test';
funTest().mockConfig({ stripe: { testkey: 'sk_test_OPJq1i4HPWL0bjddnWR8Oj76' }});
import { getVal, getUID, getOrCreateCustomer } from '../src/stripe/helpers';
import { mockSource } from './test-helpers';

const UID = 'xyz123';

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

test('createCustomer() create a new stripe customer', async () => {
    const user = { uid: UID, email: 'stripetest@fireship.io' };
    const cust = await getOrCreateCustomer(user.uid);
    expect(cust.email).toEqual(user.email);
    expect(cust.id).toContain('cus_');
    expect(cust.metadata.firebaseUID).toEqual(user.uid);
});


// test('attachSource() attaches payment source stripe customer', async () => {
//     const cust = await getOrCreateCustomer(UID);
//     const source = await mockSource(cust.id);
//     console.log(source);
//     expect(source.id).toContain('src_');
// });
