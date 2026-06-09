import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import {
  ShoppingCart,
  Trash2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';
import { formatCurrency, getProductImage } from '@/utils/formatters';
import { toast } from 'sonner';

export function CartPage() {
  const navigate = useNavigate();
  const { userId, userEmail } = useUser();
  const {
    items,
    loading,
    actionLoading,
    error,
    subtotal,
    fetchCart,
    removeItem,
    clearCart,
    checkout,
  } = useCart(userId);

  const [email, setEmail] = useState(userEmail || '');
  const [checkingOut, setCheckingOut] = useState(false);

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!email.trim()) { toast.error('Please enter your email'); return; }
    setCheckingOut(true);
    try {
      const result = await checkout(email.trim());
      toast.success(result?.message || 'Order placed!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  // Simulate delivery charges
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-heading font-bold text-2xl mb-2">Shopping Cart</h1>

      {error && <ErrorAlert message={error} onRetry={fetchCart} />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        /* ─── EMPTY CART ─── */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
            <ShoppingCart className="h-9 w-9 text-muted-foreground" />
          </div>
          <p className="font-heading font-bold text-xl">Your cart is empty</p>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            Looks like you haven't added anything yet. Start shopping to fill it up!
          </p>
          <Button size="lg" onClick={() => navigate('/products')} className="gap-2">
            <ShoppingBag className="h-4 w-4" /> Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* ─── CART ITEMS ─── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Select / Clear bar */}
            <div className="flex items-center justify-between bg-white rounded-xl border px-4 py-2.5">
              <span className="text-sm font-medium">
                {items.length} item{items.length !== 1 ? 's' : ''} in cart
              </span>
              <button
                onClick={() => clearCart().then(() => toast.success('Cart cleared'))}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                disabled={actionLoading}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove all
              </button>
            </div>

            {items.map((item) => (
              <Card key={item.productId} className="bg-white border">
                <CardContent className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted/20">
                    <img
                      src={getProductImage({ id: item.productId })}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/c${item.productId}/80/80`; }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-semibold text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      {subtotal >= 499 ? 'FREE Delivery' : 'Add ₹' + (499 - subtotal).toFixed(0) + ' more for free delivery'}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border rounded overflow-hidden text-sm">
                        <span className="px-3 py-1 bg-muted/30 text-xs">{item.quantity}</span>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-heading font-bold text-base text-primary">
                          {formatCurrency(item.totalPrice)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          disabled={actionLoading}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ─── ORDER SUMMARY ─── */}
          <div className="space-y-4">
            {/* Promo */}
            {delivery > 0 && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    Add <strong>{formatCurrency(499 - subtotal)}</strong> more to get FREE delivery!
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border sticky top-24">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-heading font-bold text-lg">Price Details</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price ({items.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charges</span>
                    {delivery === 0 ? (
                      <span className="text-emerald-600 font-medium">FREE</span>
                    ) : (
                      <span>{formatCurrency(delivery)}</span>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-heading font-bold text-base">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                  {delivery === 0 && (
                    <p className="text-xs text-emerald-600">🎉 You saved ₹49 on delivery!</p>
                  )}
                </div>

                <Separator />

                {/* Email for confirmation */}
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-email" className="text-sm">
                    Email for order confirmation
                  </Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 text-sm"
                  onClick={handleCheckout}
                  disabled={checkingOut || actionLoading || !email.trim()}
                >
                  {checkingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                  Place Order <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Safe and Secure Payments
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
