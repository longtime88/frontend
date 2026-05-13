const rawStorefrontBaseUrl =
  process.env.NEXT_PUBLIC_SHOPWARE_STOREFRONT_URL ?? "http://localhost:8000";

const storefrontBaseUrl = rawStorefrontBaseUrl.replace(/\/+$/, "");

export const SHOPWARE_CART_URL = `${storefrontBaseUrl}/checkout/cart`;
export const SHOPWARE_CONFIRM_URL = `${storefrontBaseUrl}/checkout/confirm`;
export const SHOPWARE_ACCOUNT_REGISTER_URL = `${storefrontBaseUrl}/account/login#register`;
