'use client'

import { Product } from '../components/Product';
import { useState } from 'react';
import Data from "../Data.json"

export  const Products = () => {
  const [products] = useState(Data.products);
  return (
    <div className='container'>
      {
        products.map(p => (
        
          <Product key={p.id} product={p} />
          
        ))
      }
    </div>
  )
}


