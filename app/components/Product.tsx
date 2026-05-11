'use client'

import Image from 'next/image'
import { SHOPWARE_CART_URL } from '@/lib/shopwareStorefront';

type ProductItem = {
  id: number | string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
};

export const Product = ({ product }: { product: ProductItem }) => {
  const productName = product.name ?? product.title ?? "Produkt";
  const productImage = product.image
    ? product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : "/next.svg";

  return (
    <div className='card' style={{ width: '18rem' }}>
      <Image src={productImage} alt={productName} width={150} height={150} />
      <div className='card-body'>
        <h5 className='card-title'>{productName}</h5>
        <p className='card-text'>{product.price} â‚¬</p>
        <a href={SHOPWARE_CART_URL} className='btn btn-primary'>In den Warenkorb</a>
      </div>
    </div>
  );
};

export default Product
