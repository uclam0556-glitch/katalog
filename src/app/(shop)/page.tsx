import React from "react";
import HomeClient from "./HomeClient";
import { getProducts } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  return <HomeClient initialProducts={products} />;
}
