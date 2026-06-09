import { Badge } from '@/components/ui/badge';
import { PAYMENT_STATUS } from '@/constants';

const variantMap = {
  [PAYMENT_STATUS.PENDING]: 'secondary',
  [PAYMENT_STATUS.SUCCESS]: 'default',
  [PAYMENT_STATUS.FAILED]: 'destructive',
};

const colorMap = {
  [PAYMENT_STATUS.PENDING]:
    'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',
  [PAYMENT_STATUS.SUCCESS]:
    'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  [PAYMENT_STATUS.FAILED]:
    'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
};

/**
 * Badge for payment status (PENDING / SUCCESS / FAILED).
 */
export function PaymentStatusBadge({ status }) {
  const cls = colorMap[status] ?? 'bg-muted text-muted-foreground';
  return (
    <Badge variant="outline" className={`font-semibold text-xs ${cls}`}>
      {status ?? '—'}
    </Badge>
  );
}

/**
 * Badge for product stock status.
 */
export function StockBadge({ stock }) {
  if (stock > 10)
    return (
      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
        In Stock
      </Badge>
    );
  if (stock > 0)
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
        Low Stock ({stock})
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
      Out of Stock
    </Badge>
  );
}
