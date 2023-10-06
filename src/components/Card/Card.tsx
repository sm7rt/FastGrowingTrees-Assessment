import { Box, Card as ChakraCard, CardBody, CardFooter, Text } from '@chakra-ui/react';
import Image from 'next/image';
import styles from './Card.module.css';

const imgHeight = '15.75rem';
const imgWidth = '100%';
const textMaxWidth = '8.625rem';

type CardProps = {
  src: string;
  title: string;
};

export default function Card({ src, title }: CardProps): JSX.Element {
  return (
    <ChakraCard
      display="inline-flex"
      size="lg"
      borderRadius="md"
      borderColor="rgba(196, 196, 196, 0.75)"
      borderWidth={1}
      boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.1)"
      w="100%"
      h="100%"
    >
      <CardBody p="0" overflow="hidden">
        <Box position={'relative'} h={imgHeight} w={imgWidth} borderTopRadius="lg">
          <Image
            src={src}
            alt={title}
            className={styles.image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </Box>
      </CardBody>
      <CardFooter paddingX={4} py={4} justifyContent="center">
        <Text fontSize="md" maxW={textMaxWidth} overflowWrap="break-word" textAlign="center">
          {title}
        </Text>
      </CardFooter>
    </ChakraCard>
  );
}
