'use client'

import React from 'react'
import Data from "../Data.json"
import Image from 'next/image'


 export const Product = ({product}:any) => {
  return (
    <div className='card' style={{ width: '18rem' }}>
      <img src={product.image} alt={product.name} width={150} height={150} className="" />
      <div className='card-body'>
        <h5 className='card-title'>{product.name}</h5>
        <p className='card-text'>{product.price} €</p>
        <a href={`/Warenkorb/${product.id}`} className='btn btn-primary'>In den Warenkorb</a>
        
      </div>
    </div>
  );
};

export default Product
