import { fun } from './test-config';
fun.cleanup;


import { db, stripe } from '../src/config';


test('Firestore is initialized', () => {
    expect(db).toBeDefined();
});

test('Stripe is initialized', () => {
    expect(stripe).toBeDefined();
});