import { fun } from './test-config';
fun.cleanup;

import { mockUser, getMockSource } from './mocks';
import { createCustomer, getUser } from '../src/stripe/customers';
import { createOrder } from '../src/stripe/orders';

let user: any;

beforeAll( async () => {
  user = await mockUser();
  await createCustomer(user);
});

test('createSubscription creates a subscription', async () => {
  const sku = 'sku_EcYoWGwIvW7AFt';

  const mockSource = await getMockSource();

  const order = await createOrder(user.uid, mockSource.id, sku);

  expect(order.id).toContain('or_')
  expect(order.amount).toBe(30000);

  const userDoc = await getUser(user.uid);

  expect(userDoc.is_pro).toBe(true);
  expect(userDoc.pro_status).toBe('lifetime');

});