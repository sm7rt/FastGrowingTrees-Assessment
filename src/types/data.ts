export type RawData = {
  products: Product[];
  recommendations: Product[];
};

type OverviewProduct = Pick<Product, 'id' | 'title'>;
type OverviewThumbnail = Pick<Thumbnail, 'src'>;
export type ProductOverview = OverviewProduct & OverviewThumbnail;

type ProductDetail = Pick<Product, 'id' | 'title' | 'body' | 'price' | 'product_type'>;
type ProductDetailImage = Pick<Thumbnail, 'src' | 'alt'>;

export type ParsedProduct = ProductDetail & ProductDetailImage;

export type Product = {
  id: number;
  title: string;
  body: string;
  vendor: string;
  product_type: string;
  price: number;
  tags: string;
  images: Thumbnail[];
  thumbnail: Thumbnail;
};

type Thumbnail = {
  id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  alt: null | string;
  width: number;
  height: number;
  src: string;
  variant_ids: unknown[];
};
