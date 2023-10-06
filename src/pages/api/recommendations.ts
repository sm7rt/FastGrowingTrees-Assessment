import { ParsedProduct, Product, RawData } from '@/types/data';
import data from '../../data.json';

function parseRecommendations(data: RawData): ParsedProduct[] {
  function parseData(data: Product[]) {
    return data.map((recommendation) => {
      const { id, title, body, price, product_type, images } = recommendation;
      const { src, alt } = images[0];
      return { id, title, body, price, product_type, src, alt };
    });
  }

  const { recommendations } = data;
  return parseData(recommendations);
}

export const config = {
  runtime: 'edge',
};

export default function handler() {
  const parsedData = parseRecommendations(data);
  return new Response(JSON.stringify(parsedData), {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      'content-type': 'application/json',
    },
  });
}
