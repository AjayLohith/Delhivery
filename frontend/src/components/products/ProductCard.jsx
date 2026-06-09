import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2, Star } from 'lucide-react';
import { getProductImage, formatCurrency, truncate } from '@/utils/formatters';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';

/**
 * Customer-facing product card for the storefront grid.
 */
export function ProductCard({ product }) {
  const { userId } = useUser();
  const { addToCart } = useCart(userId);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Don't navigate when clicking "Add to Cart"
    if (!userId) {
      toast.error('Please set your User ID first');
      return;
    }
    setAdding(true);
    try {
      await addToCart({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      });
      toast.success(`Added to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stock === 0;
  // Fake star rating for visual appeal (deterministic from id)
  const stars = 3.5 + ((product.id ?? 1) % 15) / 10;
  const reviewCount = 20 + ((product.id ?? 1) * 7) % 800;

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <Card className="overflow-hidden h-full flex flex-col border hover:shadow-md transition-shadow bg-white">
        {/* Image */}
        <div className="relative overflow-hidden bg-muted/20 aspect-square">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/prod${product.id}/300/300`;
            }}
          />
          {product.category && (
            <Badge className="absolute top-2 left-2 text-[10px] bg-white/90 text-foreground border shadow-xs">
              {product.category}
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground bg-white px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col flex-1 gap-1 p-3">
          {/* Title */}
          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-3 w-3"
                  fill={s <= Math.round(stars) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString('en-IN')})</span>
          </div>

          {/* Price */}
          <p className="font-heading font-bold text-lg text-primary mt-1">
            {formatCurrency(product.price)}
          </p>

          {/* Free delivery tag */}
          <p className="text-xs text-emerald-600 font-medium">FREE Delivery</p>

          {/* Add to cart */}
          <Button
            className="w-full mt-auto gap-1.5 text-xs h-8"
            size="sm"
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock || !userId}
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
