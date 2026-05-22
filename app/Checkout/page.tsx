import { cookies } from "next/headers";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const contextToken =
    cookieStore.get("sw-context-token")?.value || "";

  return <CheckoutClient initialContextToken={contextToken} />;
}
