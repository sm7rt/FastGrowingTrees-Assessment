import { PropsWithChildren } from 'react';
import { Text, VStack } from '@chakra-ui/react';

type DetailCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

export default function DetailCard({ title, subtitle, body, children }: PropsWithChildren<DetailCardProps>) {
  return (
    <VStack spacing={4} alignItems="normal" bgColor="white" p={4} h="fit-content">
      <Text fontSize="4xl" fontWeight={500} lineHeight={10}>
        {title}
      </Text>
      <Text fontWeight={500}>{subtitle}</Text>
      <Text lineHeight={6}>{body}</Text>
      {children}
    </VStack>
  );
}
