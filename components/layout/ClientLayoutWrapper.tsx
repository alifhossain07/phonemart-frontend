"use client";

import { useState, useEffect } from "react";
import CartSidebar from "@/components/layout/CartSidebar";
import { useCart } from "@/app/context/CartContext";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [externalOpen, setExternalOpen] = useState(false);
  const { cartOpen, setCartOpen } = useCart();

  // Sync CartContext's cartOpen with externalOpen
  useEffect(() => {
    if (cartOpen && !externalOpen) {
      setExternalOpen(true);
    }
  }, [cartOpen, externalOpen]);

  // Sync externalOpen with CartContext when closed externally
  useEffect(() => {
    if (!externalOpen && cartOpen) {
      setCartOpen(false);
    }
  }, [externalOpen, cartOpen, setCartOpen]);

  return (
    <>
      <CartSidebar externalOpen={externalOpen} setExternalOpen={setExternalOpen} />
      {children}
    </>
  );
}
