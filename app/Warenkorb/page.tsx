'use client';

import { useEffect } from 'react';
import { SHOPWARE_CART_URL } from '@/lib/shopwareStorefront';

export default function Basket() {
  useEffect(() => {
    const token = localStorage.getItem('sw-context-token') || '';

    // Set the context token as a cookie so Shopware can read it
    if (token) {
      document.cookie = `sw-context-token=${encodeURIComponent(token)}; path=/; max-age=2592000; samesite=lax`;
    }

    // Redirect to Shopware's cart page
    window.location.href = SHOPWARE_CART_URL;
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[color:var(--brand)]"></div>
        <p>Warenkorb wird geladen...</p>
      </div>
    </div>
  );
}
