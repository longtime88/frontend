'use client'

import { Product } from "./Product"

type ProductItem = {
  id: string
  title: string
  name: string
  price: number
  image: string
  description: string
}

type ProductsProps = {
  products: ProductItem[]
}

export const Products = ({ products }: ProductsProps) => {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {products.map((p) => (
        <Product
          key={p.id}
          product={{
            id: p.id,
            name: p.name || p.title,
            title: p.title,
            price: p.price,
            image: p.image,
            description: p.description,
            shopwareProductId: p.id,
          }}
        />
      ))}
    </div>
  )
}

