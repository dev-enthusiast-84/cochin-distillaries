import { Card } from "@/components/ui";
import { formatPrice, type Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price_cents, product.currency);
  const details = [
    product.abv != null && `${product.abv}% ABV`,
    product.volume_ml != null && `${product.volume_ml} ml`,
  ].filter(Boolean);

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wide text-muted">
        <span>{product.category}</span>
        {product.members_only && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
            Members
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-muted">{product.description}</p>
      )}
      <div className="mt-auto flex items-baseline justify-between pt-2 text-sm">
        <span className="text-muted">{details.join(" · ")}</span>
        {price && <span className="font-medium">{price}</span>}
      </div>
    </Card>
  );
}
