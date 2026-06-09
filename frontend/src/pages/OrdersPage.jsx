import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import {
  Package,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { useUser } from '@/context/UserContext';
import { formatCurrency, formatDate, formatShortDate } from '@/utils/formatters';
import { PAYMENT_STATUS } from '@/constants';

const STATUS_CONFIG = {
  [PAYMENT_STATUS.PENDING]: {
    label: 'Payment Pending',
    icon: Clock,
    className: 'bg-amber-100 text-amber-800 border-amber-200',
    bar: 'bg-amber-400',
  },
  [PAYMENT_STATUS.SUCCESS]: {
    label: 'Payment Successful',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bar: 'bg-emerald-500',
  },
  [PAYMENT_STATUS.FAILED]: {
    label: 'Payment Failed',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200',
    bar: 'bg-red-500',
  },
};

export function OrdersPage() {
  const { userId } = useUser();
  const { payments, loading, error, refetch } = usePayments(userId);
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((p) => (p === id ? null : id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {userId ? `Orders for: ${userId}` : 'Set your User ID to view orders'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && <ErrorAlert message={error} onRetry={refetch} />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
            <Package className="h-9 w-9 text-muted-foreground" />
          </div>
          <p className="font-heading font-bold text-xl">No orders yet</p>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            {userId
              ? "You haven't placed any orders yet. Go shopping!"
              : 'Set your User ID to view your order history.'}
          </p>
          <Button size="lg" asChild>
            <Link to="/products" className="gap-2">
              <ShoppingBag className="h-4 w-4" /> Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((order) => {
            const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG[PAYMENT_STATUS.PENDING];
            const StatusIcon = config.icon;
            const isExpanded = expandedId === order.id;

            return (
              <Card key={order.id} className="bg-white border overflow-hidden">
                {/* Status bar */}
                <div className={`h-1 w-full ${config.bar}`} />

                <CardContent className="p-4">
                  {/* Order header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggle(order.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm font-mono truncate">
                          {order.orderId || `Order #${order.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Placed on {formatShortDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <div className="text-right hidden sm:block">
                        <p className="font-heading font-bold text-base text-primary">
                          {formatCurrency(order.amount)}
                        </p>
                      </div>
                      <Badge variant="outline" className={`text-xs font-semibold ${config.className}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Mobile price */}
                  <p className="font-heading font-bold text-base text-primary sm:hidden mt-2">
                    {formatCurrency(order.amount)}
                  </p>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <Detail label="Order ID" value={order.orderId || '—'} mono />
                        <Detail label="User" value={order.userId || '—'} />
                        <Detail label="Email" value={order.userEmail || '—'} />
                        <Detail label="Amount" value={formatCurrency(order.amount)} />
                        <Detail label="Status" value={order.status || '—'} />
                        <Detail label="Date" value={formatDate(order.createdAt)} />
                        {order.razorpayOrderId && (
                          <Detail label="Razorpay Order" value={order.razorpayOrderId} mono />
                        )}
                        {order.razorpayPaymentId && (
                          <Detail label="Razorpay Payment" value={order.razorpayPaymentId} mono />
                        )}
                        {order.failureReason && (
                          <Detail label="Failure Reason" value={order.failureReason} className="text-destructive col-span-2" />
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, mono, className = '' }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xs font-medium break-all mt-0.5 ${mono ? 'font-mono' : ''} ${className}`}>{value}</p>
    </div>
  );
}
