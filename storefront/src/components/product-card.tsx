import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatMoney, type ProductListItem } from "@/lib/commerce";

export function ProductCard({
  product,
  locale,
}: {
  product: ProductListItem;
  locale: string;
}) {
  return (
    <Link
      href={`/shop/${product.handle}`}
      className="group block overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          // Placeholder until product media is uploaded to Supabase Storage.
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-xs text-muted-foreground">
            {product.ipFranchise ?? product.title}
          </div>
        )}
      </div>
      <div className="p-3">
        {product.ipFranchise ? (
          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            {product.ipFranchise}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
        {product.price ? (
          <p className="mt-2 text-sm font-semibold">
            {formatMoney(product.price, locale)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
