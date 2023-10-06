import Card from '@/components/Card/Card';
import { ProductOverview } from '@/types/data';
import { SimpleGrid } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import handler from './api/products';

export async function getStaticProps() {
  const res = handler();
  const data: ProductOverview[] = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      products: data,
    },
    revalidate: 86400,
  };
}

export default function Home({ products }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <main>
        <Head>
          <title>Fastest Growing Trees</title>
          <meta name="description" content="Trees. Delivered. Yesterday." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SimpleGrid columns={[1, null, 2, 3]} spacing={8}>
          {products.map(({ src, title, id }) => (
            <Link href={`/product/${encodeURIComponent(id)}`} key={id}>
              <Card src={src} title={title} />
            </Link>
          ))}
        </SimpleGrid>
      </main>
    </>
  );
}
