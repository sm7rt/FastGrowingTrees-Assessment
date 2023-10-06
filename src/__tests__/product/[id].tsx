import { CartContext, CartProvider } from '@/context/CartContext';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Cart from '../../components/Cart/Cart';
import ProductPage from '../../pages/product/[id]';
import { testProduct } from '../../util';

describe('Product page', () => {
  it('renders page with elements', () => {
    const { src, title, body } = testProduct;
    const value = {
      cart: [testProduct],
      setCart: jest.fn(),
      recommendationData: {
        data: [],
        loading: false,
        error: false,
      },
    };

    render(
      <CartContext.Provider value={value}>
        <ProductPage product={testProduct} />
      </CartContext.Provider>,
    );

    const image = screen.getByRole('img', { src });
    expect(image).toBeInTheDocument();

    const renderedTitle = screen.getByText(title);
    expect(renderedTitle).toBeInTheDocument();

    const renderedBody = screen.getByText(body);
    expect(renderedBody).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeInTheDocument();
  });

  it('updates ticker quantity upon clicking button', async () => {
    render(
      <CartProvider>
        <Cart />
        <ProductPage product={testProduct} />
      </CartProvider>,
    );
    const button = screen.getByRole('button', { name: /add to cart/i });

    fireEvent.click(button);
    let cartCounter = await screen.findByTestId('cart-counter');
    expect(cartCounter).toHaveTextContent('1');

    fireEvent.click(button);
    cartCounter = await screen.findByTestId('cart-counter');
    expect(cartCounter).toHaveTextContent('2');
  });
});
