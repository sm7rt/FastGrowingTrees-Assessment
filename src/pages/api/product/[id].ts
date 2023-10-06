import { ParsedProduct, Product } from '@/types/data';
import type { NextRequest } from 'next/server';
import data from '../../../data.json';

const notFoundStatus = 'not found' as const;
type NotFoundStatus = typeof notFoundStatus;

function parseProductData(products: Product[], productID: number): ParsedProduct | NotFoundStatus {
  const foundProduct = products.find((product) => product.id === productID);
  if (!foundProduct) {
    return notFoundStatus;
  }

  const { id, title, body, price, product_type, images } = foundProduct;
  const { src, alt } = images[0];
  return { id, title, body, price, product_type, src, alt };
}

export const config = {
  runtime: 'edge',
};

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const parsedId = typeof id === 'string' ? parseInt(id) : id;

  if (!parsedId || typeof parsedId !== 'number') {
    return new Response(JSON.stringify({ error: 'Bad request: please provide a valid number as "id" query param' }), {
      status: 400,
    });
  }

  const parsedData = parseProductData(data.products, parsedId);
  if (parsedData === notFoundStatus) {
    return new Response(JSON.stringify({ error: `Not found: product with id of ${id} was not found` }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(parsedData), {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      'content-type': 'application/json',
    },
  });
}
