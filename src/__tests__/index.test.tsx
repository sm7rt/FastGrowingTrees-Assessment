import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

const testProducts = [
  {
    id: 4813305610302,
    title: 'Corona ClassicCUT® Pruners - 3/4 in.',
    src: 'https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Corona_Pruner_600x600_ed156d74-9ce0-43b3-82ad-986a24d0ead3.jpg?v=1620936001',
  },
  {
    id: 1532751872052,
    title: 'Tree Planting Kit',
    src: 'https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Tree_Planting_Kit_600x600_c676f3ae-ac32-494c-a57e-bfdbe402e488.jpg?v=1609869267',
  },
];

describe('Home', () => {
  it('renders product links', () => {
    render(<Home products={testProducts} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
