import { fun } from './test-config';
fun.cleanup;

import { mockUser, getMockSource } from './mocks';
import { attachSource } from '../src/stripe/sources';

let user: any;

beforeAll( async () => {
  user = await mockUser();
});

test('attachSource attaches a payment source the customer', async () => {
  const mockSource = await getMockSource();
  const customer:any = await attachSource(user.uid, mockSource.id);
  expect(customer.id).toContain('cus_')
  expect(customer['sources'].data.length).toBeGreaterThan(0);
});