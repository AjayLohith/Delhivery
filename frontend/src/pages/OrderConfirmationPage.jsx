import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderTrackingTimeline } from '@/components/shared/OrderTrackingTimeline';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { HeadingXL, HeadingSM, MutedText, BodyText } from '@/components/shared/Typography';
import {
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  Mail,
  Calendar,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import { formatCurrency, formatDate, formatShortDate } from '@/utils/formatters';
import { toast } from 'sonner';

/**
 * Order confirmation page showing order details and tracking timeline.
 */
export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [orderData, trackingData] = await Promise.all([
          paymentService.getByOrder(orderId),
          paymentService.getTracking(orderId),
        ]);
        setOrder(orderData);
        setTracking(Array.isArray(trackingData) ? trackingData : []);
      } catch (err) {
        setError(err.message || 'Failed to load order');
        toast.error('Could not load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <ErrorAlert
          message={error || 'Order not found'}
          onRetry={() => window.location.reload()}
        />
        <Button variant="outline" onClick={() => navigate('/orders')}>
          ← Back to Orders
        </Button>
      </div>
    );
  }

  const paymentMethodLabel =
    order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI / Razorpay';
  const paymentStatus = order.status || 'PENDING';

  const statusBadgeConfig = {
    SUCCESS: { label: 'Payment Confirmed', color: 'bg-emerald-100 text-emerald-800' },
    PENDING: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-800' },
    FAILED: { label: 'Payment Failed', color: 'bg-red-100 text-red-800' },
    COD_PENDING: { label: 'Pending Delivery', color: 'bg-blue-100 text-blue-800' },
    COD_DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  };

  const statusConfig = statusBadgeConfig[paymentStatus] || {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Success banner */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <HeadingSM>Order Confirmed!</HeadingSM>
            <BodyText className="mt-1 text-emerald-900">
              Thank you for your order. A confirmation email has been sent to{' '}
              <span className="font-semibold">{order.userEmail}</span>
            </BodyText>
          </div>
        </CardContent>
      </Card>

      {/* Order header */}
      <div className="space-y-2">
        <HeadingXL>Order #{order.orderId}</HeadingXL>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={`font-semibold text-xs ${statusConfig.color}`}>
            {statusConfig.label}
          </Badge>
          <MutedText>Placed on {formatDate(order.createdAt)}</MutedText>
        </div>
      </div>

      {/* Order details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <MutedText className="text-xs">Total Amount</MutedText>
              <HeadingSM className="font-heading font-bold text-lg text-primary mt-1">
                {formatCurrency(order.totalAmount || 0)}
              </HeadingSM>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <MutedText className="text-xs">Payment Method</MutedText>
              <HeadingSM className="font-semibold text-sm mt-1">{paymentMethodLabel}</HeadingSM>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <MutedText className="text-xs">Estimated Delivery</MutedText>
              <HeadingSM className="font-semibold text-sm mt-1">
                {order.estimatedDelivery ? formatShortDate(order.estimatedDelivery) : '5 days'}
              </HeadingSM>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <MutedText className="text-xs">Confirmation Email</MutedText>
              <HeadingSM className="font-semibold text-xs mt-1 break-all">{order.userEmail}</HeadingSM>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order items */}
      {order.items && order.items.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <HeadingSM>Items Ordered</HeadingSM>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start p-2 bg-muted/20 rounded">
                  <div>
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {formatCurrency(item.totalPrice || 0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price breakdown */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-sm mb-3">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal || 0)}</span>
            </div>
            {order.discountAmount && order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            {order.codFee && order.codFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">COD Handling Fee</span>
                <span>+{formatCurrency(order.codFee)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.totalAmount || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order tracking timeline */}
      <div>
        <HeadingSM>Order Tracking</HeadingSM>
        <MutedText className="mt-1 mb-4">
          Real-time updates on your order status and delivery
        </MutedText>
        <OrderTrackingTimeline tracking={tracking} loading={false} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          onClick={() => navigate('/products')}
          className="flex-1 sm:flex-none gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/orders')}
          className="flex-1 sm:flex-none gap-2"
        >
          View All Orders
        </Button>
      </div>
    </div>
  );
}
