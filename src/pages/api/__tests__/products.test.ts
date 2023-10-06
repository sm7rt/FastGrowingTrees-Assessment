import handler from '../products';

describe('/api/products', () => {
  test('returns a 200 response with all products', async () => {
    const res: Response = handler();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          src: expect.any(String),
        }),
      ]),
    );
  });
});
