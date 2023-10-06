import handler from '../recommendations';

describe('/api/recommendations', () => {
  test('returns a 200 response', async () => {
    const res: Response = handler();
    expect(res.status).toBe(200);
  });
});
