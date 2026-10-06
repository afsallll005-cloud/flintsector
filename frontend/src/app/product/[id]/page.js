import { notFound } from "next/navigation";
import { PRODUCTS, getProductById } from "@/data/products";
import { fetchProductById } from "@/utils/api";
import { ProductDetails } from "@/components/ProductDetails/ProductDetails";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id ? decodeURIComponent(resolvedParams.id) : null;
  let product = id ? getProductById(id) : null;
  if (!product && id) {
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
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id ? decodeURIComponent(resolvedParams.id) : null;
  let product = id ? getProductById(id) : null;
  if (!product && id) {
    try {
      product = await fetchProductById(id);
    } catch (e) {
      // ignore
    }
  }
  if (!product) notFound();
  return <ProductDetails product={product} />;
}

