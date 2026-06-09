import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Truck, ShoppingBag } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency, getProductImage, truncate } from '@/utils/formatters';
import { ProductGridSkeleton } from '@/components/shared/LoadingState';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { useState } from 'react';

const CATEGORIES = [
  { label: 'Electronics', emoji: '📱', value: 'Electronics', bg: 'bg-blue-50' },
  { label: 'Fashion', emoji: '👗', value: 'Clothing', bg: 'bg-pink-50' },
  { label: 'Home & Kitchen', emoji: '🏠', value: 'Home & Kitchen', bg: 'bg-amber-50' },
  { label: 'Beauty', emoji: '💄', value: 'Beauty', bg: 'bg-rose-50' },
  { label: 'Sports', emoji: '🏃', value: 'Sports', bg: 'bg-green-50' },
  { label: 'Books', emoji: '📚', value: 'Books', bg: 'bg-purple-50' },
  { label: 'Toys', emoji: '🎮', value: 'Toys', bg: 'bg-cyan-50' },
  { label: 'Automotive', emoji: '🚗', value: 'Automotive', bg: 'bg-slate-50' },
];

function FeaturedProductCard({ product }) {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { addToCart } = useCart(userId);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!userId) { toast.error('Please set your User ID first'); return; }
    setAdding(true);
    try {
      await addToCart({ productId: product.id, productName: product.name, price: product.price, quantity: 1 });
      toast.success(`"${product.name}" added to cart`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <Card className="overflow-hidden border hover:shadow-md transition-shadow h-full">
        <div className="aspect-square overflow-hidden bg-muted/20">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/p${product.id}/300/300`; }}
          />
        </div>
        <CardContent className="p-3">
          <p className="text-sm font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">{product.name}</p>
          <p className="text-base font-bold text-primary mt-1">{formatCurrency(product.price)}</p>
          {product.stock > 0 ? (
            <Button
              size="sm"
              className="w-full mt-2 text-xs h-8"
              onClick={handleAdd}
              disabled={adding}
            >
              {adding ? 'Adding…' : 'Add to Cart'}
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-8" disabled>
              Out of Stock
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { products, loading } = useProducts({});

  const inStock = products.filter((p) => p.stock > 0);
  const featured = inStock.slice(0, 8);
  const dealProducts = inStock.slice(0, 4);

  return (
    <div>
      {/* ─── HERO BANNER ─── */}
      <section className="relative overflow-hidden bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <Badge className="bg-amber-400 text-foreground hover:bg-amber-400 text-xs font-semibold mb-4">
              🎉 Mega Sale — Up to 60% Off
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl leading-tight mb-4">
              Shop Smarter.<br />
              <span className="text-amber-300">Delivered Faster.</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Millions of products at your fingertips. Pan-India delivery in 24 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-amber-50 font-bold gap-2"
                onClick={() => navigate('/products')}
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 gap-2"
                onClick={() => navigate('/orders')}
              >
                Track Orders
              </Button>
            </div>
            {/* Mini trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 text-white/70 text-xs">
              <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Free delivery ₹499+</span>
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> 24-hr delivery</span>
              <span className="flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> 1M+ products</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden w-full max-w-sm aspect-[4/3] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1753806901294-bb48ab9bede2?crop=entropy&cs=srgb&fm=jpg&w=600&q=80"
                alt="Delhivery fast delivery"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-heading font-bold text-lg">Lightning Fast</p>
                <p className="text-sm text-white/80">Delivery across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        />
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="bg-white py-8 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading font-bold text-xl mb-5">Shop by Category</h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.value)}`)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${cat.bg} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-foreground text-center leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH DEALS ─── */}
      {(loading || dealProducts.length > 0) && (
        <section className="bg-white py-8 border-b">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-bold text-xl">Flash Deals</h2>
                <Badge className="bg-primary text-white text-xs">Limited Time</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="gap-1 text-primary">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {dealProducts.map(p => <FeaturedProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="bg-secondary py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-xl">Featured Products</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="gap-1 text-primary">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map(p => <FeaturedProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No products yet. Start the backend and add products!</p>
              <Button className="mt-4" onClick={() => navigate('/admin')}>Go to Admin</Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="bg-foreground py-10">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <p className="font-heading font-bold text-2xl">First Order?</p>
            <p className="text-white/70 mt-1">Get ₹100 off on orders above ₹999. Use code <span className="text-primary font-mono font-bold">DELHIVERY100</span></p>
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 shrink-0"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </Button>
        </div>
      </section>
    </div>
  );
}
