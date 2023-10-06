import Image from 'next/image';
import Link from 'next/link';
import { Flex } from '@chakra-ui/react';
import iconSVG from '../assets/icon.svg';
import Cart from './Cart/Cart';

export default function Navbar() {
  return (
    <header>
      <Flex justifyContent="space-between" alignItems="center" mb={10}>
        <Link href="/">
          <Image src={iconSVG} alt="cluster of trees" />
        </Link>
        <Cart />
      </Flex>
    </header>
  );
}
