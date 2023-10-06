export function formatUSD(num: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

export const primaryRed = '#CD0100';

export const testProduct = {
  id: 4813305610302,
  title: 'Corona ClassicCUT® Pruners - 3/4 in.',
  src: 'https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Corona_Pruner_600x600_ed156d74-9ce0-43b3-82ad-986a24d0ead3.jpg?v=1620936001',
  body: "When it comes to pruning, it's critical to protect your plants and shrubs with the right equipment - including sharp, sturdy pruners that will allow you to make a clean cut. Whether you're pruning to shape your plants, remove dead branches or encourage flower and fruit development, these Corona ClassicCUT® Pruners will do the job.",
  product_type: 'Hard Good',
  price: 14.95,
  alt: null,
};
