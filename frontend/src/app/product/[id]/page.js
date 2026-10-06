import { notFound } from "next/navigation";
import { PRODUCTS, getProductById } from "@/data/products";
import { fetchProductById } from "@/utils/api";
import { ProductDetails } from "@/components/ProductDetails/ProductDetails";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  let product = getProductById(id);
  if (!product) {
    try {
      product = await fetchProductById(id);
    } catch (e) {
      // ignore
    }
  }
  if (!product) {
    return { title: "Product | FLINT SECTOR" };
  }
  return {
    title: `${product.name} | FLINT SECTOR`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product = getProductById(id);
  if (!product) {
    try {
      product = await fetchProductById(id);
    } catch (e) {
      // ignore
    }
  }
  if (!product) notFound();
  return <ProductDetails product={product} />;
}

