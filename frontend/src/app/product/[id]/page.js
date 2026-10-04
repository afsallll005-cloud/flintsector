import { notFound } from "next/navigation";
import { PRODUCTS, getProductById } from "@/data/products";
import { ProductDetails } from "@/components/ProductDetails/ProductDetails";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
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
  const product = getProductById(id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
