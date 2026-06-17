import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { CheckoutModal } from '@/components/cart/CheckoutModal';
import {
  ShoppingCart,
  Trash2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';
import { paymentService } from '@/services/paymentService';
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
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async (checkoutRequest) => {
    setCheckingOut(true);
    try {
      const result = await checkout(checkoutRequest);
      
      // Backend returns orderId in message string: "Order ID: ORD-XXXXXXXX"
      let orderId = result?.orderId || result?.id;
      if (!orderId && result?.message) {
        // Extract orderId from message like "Order ID: ORD-12345678"
        const match = result.message.match(/Order ID: (ORD-[A-Z0-9]+)/);
        orderId = match ? match[1] : null;
      }

      if (!orderId) {
        throw new Error('Order creation failed - no order ID');
      }

      setCheckoutModalOpen(false);

      // For ONLINE payment, load Razorpay and open checkout
      if (checkoutRequest.paymentMethod === 'ONLINE') {
        try {
          // Wait for Razorpay script to be available
          let razorpayRetries = 10;
          while (razorpayRetries > 0 && !window.Razorpay) {
            await new Promise(resolve => setTimeout(resolve, 200));
            razorpayRetries--;
          }

          if (!window.Razorpay) {
            throw new Error('Razorpay not available. Continuing with order...');
          }

          // Fetch order to get razorpayOrderId (with retry - Kafka might not have processed yet)
          let orderData = null;
          let dataRetries = 15; // Retry up to 3 seconds (15 * 200ms)
          while (dataRetries > 0 && !orderData?.razorpayOrderId) {
            try {
              orderData = await paymentService.getByOrder(orderId);
              if (orderData?.razorpayOrderId) {
                console.log('✅ Got Razorpay Order ID:', orderData.razorpayOrderId);
                break;
              }
            } catch (err) {
              console.log(`⏳ Waiting for payment record... (${15 - dataRetries + 1}/15)`);
            }
            await new Promise(resolve => setTimeout(resolve, 200));
            dataRetries--;
          }

          if (!orderData?.razorpayOrderId) {
            throw new Error('Payment service failed. Try again in a moment.');
          }

          const finalAmount = orderData.totalAmount;

          console.log('💳 Opening Razorpay with:', {
            razorpayOrderId: orderData.razorpayOrderId,
            amount: Math.round(finalAmount * 100),
            email: checkoutRequest.email || userEmail,
          });

          // Open Razorpay with try-catch to handle internal errors
          try {
            const razorpayOptions = {
              key: 'rzp_test_T2Npf8ixdFEHQd',
              order_id: orderData.razorpayOrderId,
              amount: Math.round(finalAmount * 100),
              currency: 'INR',
              name: 'Delhivery',
              description: 'Product Purchase',
              prefill: {
                email: checkoutRequest.email || userEmail,
              },
              theme: {
                color: '#3b82f6',
              },
              retry: {
                enabled: true,
                max_count: 3,
              },
              handler: async (response) => {
                console.log('✅ Payment handler received:', {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                });
                try {
                  // Verify payment
                  await paymentService.verify(
                    orderData.razorpayOrderId,
                    response.razorpay_payment_id
                  );
                  toast.success('Payment successful!');
                  navigate(`/orders/confirm/${orderId}`);
                } catch (err) {
                  toast.error('Payment verification failed');
                  console.error('Verification error:', err);
                }
              },
              modal: {
                ondismiss: () => {
                  console.log('❌ Payment modal dismissed');
                  toast.info('Payment cancelled');
                },
              },
            };

            console.log('🚀 Creating Razorpay instance...');
            const razorpay = new window.Razorpay(razorpayOptions);
            console.log('🎯 Opening Razorpay modal...');
            razorpay.open();
            console.log('✨ Razorpay modal opened successfully');
            return;
          } catch (razorpayErr) {
            console.error('❌ Razorpay modal error:', razorpayErr);
            toast.error('Payment gateway error. Continuing with order...');
          }
        } catch (err) {
          console.error('Razorpay setup error:', err);
          // Don't block checkout if Razorpay fails
          toast.info('Proceeding with your order...');
        }
      }

      // For COD or if Razorpay fails, redirect to confirmation
      toast.success('Order created successfully!');
      navigate(`/orders/confirm/${orderId}`);
    } catch (err) {
      toast.error(err.message || 'Checkout failed');
      console.error('Checkout error:', err);
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
                      src={getProductImage({ id: item.productId, name: item.productName })}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = `https://loremflickr.com/80/80/product?lock=${item.productId}`; }}
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

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setCheckoutModalOpen(true)}
                  disabled={checkingOut || items.length === 0}
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-900">Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-900">Fast delivery</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        items={items}
        userEmail={userEmail}
        onCheckout={handleCheckout}
        loading={checkingOut}
      />
    </div>
  );
}
