import type { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import handler from '../../product/[id]';

describe('/api/product/[id]', () => {
  function createMockRequest(id?: string) {
    const url = `http://localhost:3000/api/product?id=${id}}`;
    const { req }: { req: NextRequest } = createMocks({
      method: 'GET',
      url,
    });
    return req;
  }

  test('returns a 200 response with a product', async () => {
    const givenID = '1532751740980';
    const req = createMockRequest(givenID);
    const res = handler(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual(expect.objectContaining({ id: parseInt(givenID) }));
  });

  test('returns a 400 response if no query is provided', async () => {
    const req = createMockRequest();
    const res = handler(req);
    expect(res.status).toBe(400);
  });

  test('returns a 400 response if query id is not a number', async () => {
    const req = createMockRequest('not a number');
    const res = handler(req);
    expect(res.status).toBe(400);
  });

  test('returns a 404 response if query id is not found', async () => {
    const req = createMockRequest('1');
    const res = handler(req);
    expect(res.status).toBe(404);
  });
});
