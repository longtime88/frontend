'use client'

import { Product } from '../components/Product';
import { useState } from 'react';
import Data from "../Data.json"
import CheckoutPage from '../Checkout/page';

export  const Products = () => {
  const [products] = useState(Data.products);
  return (
    <div className='container'>
      {
        products.map(p => (
       
          <Product key={p.id} product={p} />
          
      ))
      }
      <CheckoutPage />
    </div>
  )
}


