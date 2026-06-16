import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, DollarSign, Truck } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

/**
 * Checkout modal with payment method selection, coupon code, and order summary.
 */
export function CheckoutModal({
  open,
  onOpenChange,
  items = [],
  userEmail = '',
  onCheckout,
  loading = false,
}) {
  const [email, setEmail] = useState(userEmail);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    setEmail(userEmail);
  }, [userEmail]);

  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  
  let discount = 0;
  if (appliedCoupon === 'WELCOME10') {
    discount = subtotal * 0.1;
  }

  const codFee = paymentMethod === 'COD' ? 49 : 0;
  const total = subtotal - discount + codFee;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponCode('');
  };

  const handleCheckout = () => {
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    onCheckout({
      email: email.trim(),
      paymentMethod,
      couponCode: appliedCoupon || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Your Order</DialogTitle>
          <DialogDescription>
            Review details and choose your payment method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="checkout-email">Email Address *</Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground">
              We'll send your order confirmation to this email
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method *</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer m-0">
                  <div className="font-medium text-sm">Cash on Delivery (COD)</div>
                  <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                </Label>
                <Badge variant="outline" className="text-xs">+₹49</Badge>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="ONLINE" id="online" />
                <Label htmlFor="online" className="flex-1 cursor-pointer m-0">
                  <div className="font-medium text-sm">UPI / Razorpay</div>
                  <p className="text-xs text-muted-foreground">Pay securely online via UPI</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="coupon">Promo Code (Optional)</Label>
            {appliedCoupon ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-900">{appliedCoupon} applied</p>
                  <p className="text-xs text-emerald-700">10% discount: -{formatCurrency(discount)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-xs h-8"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-white"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  className="text-xs h-10"
                >
                  Apply
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Try: WELCOME10 for 10% off</p>
          </div>

          {/* Order Summary */}
          <Card className="bg-muted/30 border-0">
            <CardContent className="space-y-3 p-4">
              <h3 className="font-semibold text-sm">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount (10%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                {codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">COD Handling Fee</span>
                    <span>+{formatCurrency(codFee)}</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {paymentMethod === 'COD' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <p className="font-medium mb-1">💰 Cash on Delivery</p>
                  <p>Please keep ₹{total.toFixed(2)} ready when our delivery agent arrives at your door.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2 sm:flex-row-reverse">
          <Button
            size="lg"
            onClick={handleCheckout}
            disabled={loading || !email.trim()}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
