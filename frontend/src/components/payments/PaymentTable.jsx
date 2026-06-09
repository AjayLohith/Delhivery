import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate, formatShortDate } from '@/utils/formatters';

/**
 * Payments history table with expandable rows for Razorpay details.
 */
export function PaymentTable({ payments }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-8" />
            <TableHead className="heading-sm">Order ID</TableHead>
            <TableHead className="heading-sm">Date</TableHead>
            <TableHead className="heading-sm">Amount</TableHead>
            <TableHead className="heading-sm">Status</TableHead>
            <TableHead className="heading-sm">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const isExpanded = expandedId === payment.id;
            return (
              <>
                <TableRow
                  key={payment.id}
                  className="cursor-pointer"
                  onClick={() => toggle(payment.id)}
                >
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">
                    {payment.orderId || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatShortDate(payment.createdAt)}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {payment.userEmail || '—'}
                  </TableCell>
                </TableRow>

                {/* Expanded details row */}
                {isExpanded && (
                  <TableRow key={`${payment.id}-expanded`} className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Detail label="Payment ID" value={payment.id} />
                        <Detail label="Razorpay Order ID" value={payment.razorpayOrderId || '—'} mono />
                        <Detail label="Razorpay Payment ID" value={payment.razorpayPaymentId || '—'} mono />
                        <Detail label="User ID" value={payment.userId || '—'} />
                        {payment.failureReason && (
                          <Detail label="Failure Reason" value={payment.failureReason} className="col-span-2 text-destructive" />
                        )}
                        <Detail label="Last Updated" value={formatDate(payment.updatedAt)} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function Detail({ label, value, mono, className = '' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium break-all ${mono ? 'font-mono' : ''} ${className}`}>
        {value}
      </span>
    </div>
  );
}
