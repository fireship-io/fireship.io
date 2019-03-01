import { fun } from './test-config';
fun.cleanup;

import { mockUser, getMockSource } from './mocks';
import { createCustomer } from '../src/stripe/customers';
import { createSubscription } from '../src/stripe/subscriptions';

let user: any;

beforeAll( async () => {
  user = await mockUser();
  await createCustomer(user);
});

test('createSubscription creates a subscription', async () => {
  const plan = 'plan_DELd0Jgt7IVwF7';

  const mockSource = await getMockSource();

  const sub = await createSubscription(user.uid, mockSource.id, plan);

  expect(sub.id).toContain('sub_')
  expect(sub.status).toBe('active');
});