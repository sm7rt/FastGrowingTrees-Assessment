import { ProductOverview, Product, RawData } from '@/types/data';
import data from '../../data.json';

function parseProductsData(data: RawData): ProductOverview[] {
  function parseData(data: Product[]) {
    return data.map(({ id, title, thumbnail }) => {
      const { src } = thumbnail;
      return { id, title, src };
    });
  }

  const { products } = data;
  return parseData(products);
}

export const config = {
  runtime: 'edge',
};

export default function handler() {
  const parsedData = parseProductsData(data);
  return new Response(JSON.stringify(parsedData), {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      'content-type': 'application/json',
    },
  });
}
