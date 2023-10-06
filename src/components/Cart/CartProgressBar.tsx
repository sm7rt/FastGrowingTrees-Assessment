import { Progress, Text, VStack } from '@chakra-ui/react';
import { formatUSD } from '@/util';
import { FREE_SHIPPING_THRESHOLD } from '@/util/constants';

const percentageToFreeShipping = (subtotal: number) => Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1) * 100;
export const freeShippingStatusText = 'You qualify for free shipping!';
export const createShippingStatusText = (subtotal: number) =>
  `You're ${formatUSD(FREE_SHIPPING_THRESHOLD - subtotal)} away from free shipping`;

export default function CartProgressBar({ cartSubtotal }: { cartSubtotal: number }) {
  const getText = () => {
    if (!cartSubtotal) {
      return `Free shipping on orders over ${formatUSD(FREE_SHIPPING_THRESHOLD)}`;
    }
    if (cartSubtotal >= FREE_SHIPPING_THRESHOLD) {
      return freeShippingStatusText;
    }
    return createShippingStatusText(cartSubtotal);
  };

  return (
    <VStack spacing={3} alignItems="normal" mb={8}>
      <Text fontSize="sm" textAlign="center">
        {getText()}
      </Text>
      {cartSubtotal && <Progress colorScheme="green" height={2.5} value={percentageToFreeShipping(cartSubtotal)} />}
    </VStack>
  );
}
