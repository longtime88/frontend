import { redirect } from "next/navigation";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

export default function CheckoutPage() {
  redirect(SHOPWARE_CART_URL);
}
