import { useRef } from 'react';
import { IoCart, IoCartOutline, IoTrash } from 'react-icons/io5';
import {
  Box,
  Center,
  Circle,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useCart } from '@/context/CartContext';
import { FetchState } from '@/context/CartReducer';
import { formatUSD, primaryRed } from '@/util';
import CartItem from './CartItem';
import CartItemIncrementor from './CartItemIncrementor';
import CartProgressBar from './CartProgressBar';
import RecommendedItems from './RecommendedItems';

const dividerGray = '#D7DAD2';
const primaryGreen = '#155343';

const inlineStyles = {
  closeIcon: {
    position: 'absolute',
    left: '1.5rem',
    top: '1rem',
    fontSize: '1.5rem',
    color: primaryGreen,
  },
};

const iconButtonProps = {
  bgColor: 'transparent',
  borderStyle: 'solid',
  borderWidth: 3,
  _hover: {
    bgColor: 'transparent',
  },
  isRound: true,
};

function filterCartUniqueItems(cart: FetchState) {
  if (!cart) return [];

  const seenItems = new Set();
  return cart.filter((item) => {
    const itemString = JSON.stringify(item);
    if (!seenItems.has(itemString)) {
      seenItems.add(itemString);
      return true;
    }
    return false;
  });
}

export default function Cart() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { data, addCartItem, removeCartItem, removeCartItemQuantity } = useCart();
  const uniqueCart = filterCartUniqueItems(data);
  const cartSubtotal = data?.reduce((acc, { price }) => acc + price, 0) || 0;

  const CartCounter = () => (
    <Box position="absolute" right={-2} top={-1.5}>
      <Circle size={5} bg={primaryRed} fontSize="xs">
        <Text color="white" data-testid="cart-counter">
          {data?.length}
        </Text>
      </Circle>
    </Box>
  );

  return (
    <aside>
      <Box onClick={onOpen} position="relative">
        <IconButton
          ref={btnRef}
          aria-label="cart"
          icon={<Icon as={IoCart} boxSize={6} />}
          borderColor="initial"
          {...iconButtonProps}
        />
        {data && data.length > 0 && <CartCounter />}
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size="lg" _hover={{ bgColor: 'transparent' }} sx={inlineStyles.closeIcon} />
          <DrawerHeader>
            <Center>
              <Icon as={IoCartOutline} boxSize={10} color={primaryGreen} />
            </Center>
          </DrawerHeader>

          <DrawerBody>
            <CartProgressBar cartSubtotal={cartSubtotal} />
            {uniqueCart.map((item) => {
              const { id, title, price, src, alt } = item;
              const itemQuantity = data?.filter((item) => item.id === id).length || 0;
              return (
                <CartItem
                  key={id}
                  src={src}
                  alt={alt || title}
                  midSection={
                    <CartItemIncrementor
                      title={title}
                      price={price}
                      quantity={itemQuantity}
                      onDecrement={() => {
                        if (itemQuantity > 1) {
                          const itemIndex = data!.findIndex((item) => item.id === id);
                          if (itemIndex > -1) {
                            removeCartItemQuantity(item);
                          }
                        }
                      }}
                      onIncrement={() => {
                        const foundItem = data!.find((item) => item.id === id);
                        if (foundItem) {
                          addCartItem(foundItem);
                        }
                      }}
                    />
                  }
                >
                  <IconButton
                    onClick={() => {
                      removeCartItem(item);
                    }}
                    aria-label="remove from cart"
                    icon={<Icon as={IoTrash} boxSize={6} color={primaryRed} />}
                    borderColor={primaryRed}
                    {...iconButtonProps}
                  />
                </CartItem>
              );
            })}
            {cartSubtotal > 0 && (
              <Flex mt={4} justifyContent="space-between">
                <Text fontSize="lg" fontWeight={500}>
                  Subtotal
                </Text>
                <Text fontSize="lg" data-testid="subtotal">
                  {formatUSD(cartSubtotal)}
                </Text>
              </Flex>
            )}
            <Divider marginY={3} borderColor={dividerGray} borderWidth={4} />
            <RecommendedItems />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </aside>
  );
}
