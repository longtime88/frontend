'use client'

import { Product } from "./Product"
import Data from "../Data.json"

export  const Products = () => {
  const products = Data.products;
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {products.map((p) => (
        <Product key={p.id} product={p} />
      ))}
    </div>
  )
}


