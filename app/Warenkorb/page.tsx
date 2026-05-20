"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Warenkorb() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/Checkout");
  }, [router]);
  return null;
}
