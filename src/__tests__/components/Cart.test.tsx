import { createShippingStatusText, freeShippingStatusText } from '@/components/Cart/CartProgressBar';
import { CartContext, CartProvider } from '@/context/CartContext';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Cart from '../../components/Cart/Cart';
import ProductPage from '../../pages/product/[id]';
import { formatUSD, testProduct } from '../../util';
import { useRecommendations } from '../../hooks/useRecommendations';

const testRecommendations = [
  {
    id: 4813305610302,
    title: 'Corona ClassicCUT® Pruners - 3/4 in.',
    body: "When it comes to pruning, it's critical to protect your plants and shrubs with the right equipment - including sharp, sturdy pruners that will allow you to make a clean cut. Whether you're pruning to shape your plants, remove dead branches or encourage flower and fruit development, these Corona ClassicCUT® Pruners will do the job.",
    product_type: 'Hard Good',
    price: 14.95,
    src: 'https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Corona_Pruner_600x600_ed156d74-9ce0-43b3-82ad-986a24d0ead3.jpg?v=1620936001',
    alt: null,
  },
  {
    id: 1532751872052,
    title: 'Tree Planting Kit',
    body: 'Our Easy Kit Helps Super-Size Your Tree. Faster, healthier growth is just a click away with our Tree Planting Kit. Assembled by our horticultural specialists to nurture young trees, this kit means getting the benefits of years-long growth faster. Our Tree Planting Kit is like a green thumb in a bag, taking the hassle out of growing. We’ve assembled this expert kit in an easy-to-use package, with everything you need to properly plant and maintain your new tree.',
    vendor: 'Fast Growing Trees',
    product_type: 'Hard Good',
    price: 19.95,
    src: 'https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Tree_Planting_Kit_600x600_c676f3ae-ac32-494c-a57e-bfdbe402e488.jpg?v=1609869267',
    alt: null,
  },
];

const testTreeProduct = {
  id: 1532751740980,
  title: 'Cold Hardy Avocado Tree',
  body: "Home-grown avocados, no matter where you live. With the Cold Hardy Avocado Tree, it's possible. This strong tree withstands frigid temperatures as low as 20 degrees, living up to its name.",
  vendor: 'Fast Growing Trees',
  product_type: 'Tree',
  price: 109.95,
  alt: null,
  src: 'https://cdn.shopify.com/s/files/1/0059/8835/2052/products/Cold_Hardy_Avocado_FGT_600x600_94a0fedf-56ac-4470-aed8-b24bc2a20132.jpg?v=1612444134',
};

jest.mock('../../hooks/useRecommendations');

const mockUseRecommendations = useRecommendations as jest.MockedFunction<typeof useRecommendations>;

describe('Cart', () => {
  it('renders with product details', async () => {
    const { src, title, price } = testProduct;
    const value = {
      data: [testProduct],
      setCart: jest.fn(),
      recommendationData: {
        data: [],
        loading: false,
        error: false,
      },
    };

    render(
      <CartContext.Provider value={value}>
        <Cart />
      </CartContext.Provider>,
    );

    const cartButton = screen.getByLabelText('cart');
    expect(cartButton).toBeInTheDocument();
    fireEvent.click(cartButton);
    const img = await screen.findByRole('img', { src });
    expect(img).toBeInTheDocument();

    const renderedTitle = screen.getByText(title);
    expect(renderedTitle).toBeInTheDocument();

    const renderedPrice = screen.getAllByText(`$${price}`);
    expect(renderedPrice).toHaveLength(2); //both price and subtotal
  });

  it('updates item quantity and price upon clicking associated buttons', async () => {
    const { title, price } = testProduct;

    mockUseRecommendations.mockReturnValue({
      data: [],
      loading: false,
      error: false,
    });

    render(
      <CartProvider>
        <Cart />
        <ProductPage product={testProduct} />
      </CartProvider>,
    );

    // add product to cart
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    // open cart
    const cartButton = screen.getByLabelText('cart');
    fireEvent.click(cartButton);

    const incrementButton = await screen.getByLabelText(`increase quantity by one (${title})`);
    const subtotal = await screen.findByTestId('subtotal');
    const itemQuantity = await screen.findByTestId(`quantity of ${title.toLowerCase()}`);
    expect(itemQuantity).toHaveTextContent('1');
    expect(subtotal).toHaveTextContent(formatUSD(price));

    // increase quantity and subtotal
    fireEvent.click(incrementButton);
    expect(itemQuantity).toHaveTextContent('2');
    expect(subtotal).toHaveTextContent(formatUSD(price * 2));

    // decrease quantity and subtotal
    const decrementButton = await screen.getByLabelText(`decrease quantity by one (${title})`);
    fireEvent.click(decrementButton);
    expect(itemQuantity).toHaveTextContent('1');
    expect(subtotal).toHaveTextContent(formatUSD(price));

    //ensure that cart counter cannot go below 1 and subtotal does not change
    fireEvent.click(decrementButton);
    expect(itemQuantity).toHaveTextContent('1');
    expect(subtotal).toHaveTextContent(formatUSD(price));

    // remove item from cart
    const removeIcon = screen.getByLabelText('remove from cart');
    fireEvent.click(removeIcon);
    expect(itemQuantity).not.toBeInTheDocument();
  });

  it('updates "free shipping" status upon clicking associated buttons', async () => {
    const { title, price } = testProduct;

    mockUseRecommendations.mockReturnValue({
      data: [],
      loading: false,
      error: false,
    });

    render(
      <CartProvider>
        <Cart />
        <ProductPage product={testProduct} />
      </CartProvider>,
    );

    // add product to cart
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    // open cart
    const cartButton = screen.getByLabelText('cart');
    fireEvent.click(cartButton);

    const incrementButton = await screen.getByLabelText(`increase quantity by one (${title})`);
    const decrementButton = await screen.getByLabelText(`decrease quantity by one (${title})`);

    // check free shipping status
    let shippingStatus = createShippingStatusText(price);
    let shippingStatusText = await screen.findByText(shippingStatus);
    expect(shippingStatusText).toBeInTheDocument();

    // increase quantity
    fireEvent.click(incrementButton);

    // check free shipping status
    shippingStatus = createShippingStatusText(price * 2);
    shippingStatusText = await screen.findByText(shippingStatus);
    expect(shippingStatusText).toBeInTheDocument();

    // update quantity by 9 to trigger free shipping
    for (let i = 0; i < 9; i++) {
      fireEvent.click(incrementButton);
    }

    // check free shipping status
    shippingStatus = freeShippingStatusText;
    shippingStatusText = await screen.findByText(shippingStatus);
    expect(shippingStatusText).toBeInTheDocument();

    // decrease quantity
    fireEvent.click(decrementButton);

    // check free shipping status
    shippingStatus = createShippingStatusText(price * 10);
    shippingStatusText = await screen.findByText(shippingStatus);
    expect(shippingStatusText).toBeInTheDocument();
  });

  it('toggles pruners from "recommendations" section upon selection', async () => {
    const prunerLabel = 'add recommended item (Corona ClassicCUT® Pruners - 3/4 in.)';

    mockUseRecommendations.mockReturnValue({
      data: testRecommendations,
      loading: false,
      error: false,
    });

    render(
      <CartProvider>
        <Cart />
      </CartProvider>,
    );

    // open cart
    const cartButton = screen.getByLabelText('cart');
    fireEvent.click(cartButton);

    const prunerItem = screen.getByLabelText(prunerLabel);
    expect(prunerItem).toBeInTheDocument();

    // add pruner to cart
    const prunerAddButton = screen.getByLabelText(prunerLabel);
    fireEvent.click(prunerAddButton);
    // pruner should be removed from recommendations
    expect(prunerItem).not.toBeInTheDocument();

    // remove pruner from cart
    const removeIcon = screen.getByLabelText('remove from cart');
    fireEvent.click(removeIcon);

    // expect pruner to be back in recommendations
    const pruner = await screen.findByLabelText(prunerLabel);
    expect(pruner).toBeInTheDocument();
  });

  it('toggles tree planting kit from "recommendations" section upon kit quantity being the same as tree quantity', async () => {
    const treePlantingKitLabel = 'add recommended item (Tree Planting Kit)';

    mockUseRecommendations.mockReturnValue({
      data: testRecommendations,
      loading: false,
      error: false,
    });

    render(
      <CartProvider>
        <Cart />
        <ProductPage product={testTreeProduct} />
      </CartProvider>,
    );

    // add product to cart twice
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    fireEvent.click(button);

    // open cart
    const cartButton = screen.getByLabelText('cart');
    fireEvent.click(cartButton);

    const treePlantingKitItem = screen.getByLabelText(treePlantingKitLabel);
    expect(treePlantingKitItem).toBeInTheDocument();

    // add tree planting kit to cart
    fireEvent.click(treePlantingKitItem);
    // item should still be in recommendations
    expect(treePlantingKitItem).toBeInTheDocument();
    // add 2nd tree planting kit to cart
    fireEvent.click(treePlantingKitItem);

    // expect item to be removed from recommendations
    expect(treePlantingKitItem).not.toBeInTheDocument();
  });
});
