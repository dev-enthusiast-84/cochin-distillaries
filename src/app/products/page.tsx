import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/data";

export const metadata = { title: "Our spirits" };

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Our spirits</h1>
        <p className="text-muted">
          Members also see limited releases here.
        </p>
      </div>
      {products.length === 0 ? (
        <p className="text-muted">No products yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
