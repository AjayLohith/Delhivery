import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { StockBadge } from '@/components/shared/StatusBadge';
import {
  ShoppingCart,
  Zap,
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  Loader2,
} from 'lucide-react';
import { productService } from '@/services/productService';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';
import { formatCurrency, getProductImage } from '@/utils/formatters';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();
  const { addToCart } = useCart(userId);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productService
      .getById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async (redirect = false) => {
    if (!userId) { toast.error('Please set your User ID first'); return; }
    setAdding(true);
    try {
      await addToCart({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      });
      toast.success('Added to cart!');
      if (redirect) navigate('/cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  // Deterministic fake rating
  const stars = product ? 3.5 + ((product.id ?? 1) % 15) / 10 : 4;
  const reviewCount = product ? 20 + ((product.id ?? 1) * 7) % 800 : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground">Products</Link>
        {product && (
          <>
            <span>/</span>
            <span className="text-foreground truncate max-w-xs">{product.name}</span>
          </>
        )}
      </nav>

      {error && <ErrorAlert message={error} onRetry={() => navigate('/products')} />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Product image */}
          <div className="space-y-3">
            <div className="aspect-square rounded-xl overflow-hidden border bg-white shadow-sm">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/d${product.id}/600/600`; }}
              />
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-4">
            {product.category && (
              <Badge variant="outline" className="w-fit text-xs">{product.category}</Badge>
            )}
            <h1 className="font-heading font-bold text-2xl md:text-3xl leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4" fill={s <= Math.round(stars) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {stars.toFixed(1)} · {reviewCount.toLocaleString('en-IN')} ratings
              </span>
            </div>

            <Separator />

            {/* Price */}
            <div>
              <p className="font-heading font-extrabold text-3xl text-primary">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <Separator />

            {/* Stock */}
            <div className="flex items-center gap-3">
              <StockBadge stock={product.stock} />
              {product.stock > 0 && product.stock <= 10 && (
                <span className="text-xs text-destructive font-medium">Only {product.stock} left!</span>
              )}
            </div>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    className="px-3 py-1.5 hover:bg-muted transition-colors"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold border-x">{quantity}</span>
                  <button
                    className="px-3 py-1.5 hover:bg-muted transition-colors"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => handleAddToCart(false)}
                disabled={adding || product.stock === 0}
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 gap-2 bg-amber-400 hover:bg-amber-300 text-foreground"
                onClick={() => handleAddToCart(true)}
                disabled={adding || product.stock === 0}
              >
                <Zap className="h-4 w-4" />
                Buy Now
              </Button>
            </div>

            {/* Delivery info */}
            <Card className="p-4 space-y-3 bg-muted/30">
              {[
                { icon: Truck, text: 'FREE Delivery on orders above ₹499' },
                { icon: ShieldCheck, text: 'Secure & encrypted payment' },
                { icon: RefreshCw, text: '7-day hassle-free returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </Card>

            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 w-fit text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
