import { PropsWithChildren } from 'react';
import { Box, Center, Flex } from '@chakra-ui/react';
import Image from 'next/image';

const thumbnailSize = '110';
const maxWidth = '12.75rem';

type CartItemProps = {
  src: string;
  alt: string;
  midSection?: JSX.Element;
};

export default function CartItem({ src, alt, midSection, children }: PropsWithChildren<CartItemProps>) {
  return (
    <Flex mb={4}>
      <Image src={src} alt={alt} width={thumbnailSize} height={thumbnailSize} />
      <Box maxWidth={maxWidth}>{midSection}</Box>
      <Center ml="auto">{children}</Center>
    </Flex>
  );
}
