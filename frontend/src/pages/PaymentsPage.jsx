import { HeadingXL, MutedText } from '@/components/shared/Typography';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { TableSkeleton } from '@/components/shared/LoadingState';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { usePayments } from '@/hooks/usePayments';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, CreditCard } from 'lucide-react';
import { PAYMENT_STATUS } from '@/constants';
import { formatCurrency } from '@/utils/formatters';
import { StatCard } from '@/components/shared/StatCard';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export function PaymentsPage() {
  const { userId } = useUser();
  const { payments, loading, error, refetch } = usePayments(userId);

  const successCount = payments.filter((p) => p.status === PAYMENT_STATUS.SUCCESS).length;
  const pendingCount = payments.filter((p) => p.status === PAYMENT_STATUS.PENDING).length;
  const failedCount = payments.filter((p) => p.status === PAYMENT_STATUS.FAILED).length;
  const totalPaid = payments
    .filter((p) => p.status === PAYMENT_STATUS.SUCCESS)
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <HeadingXL>Payment History</HeadingXL>
          <MutedText className="mt-1">
            {userId ? `Showing payments for user: ${userId}` : 'Please set your User ID'}
          </MutedText>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="gap-2 shrink-0">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Paid"
            value={formatCurrency(totalPaid)}
            icon={<CreditCard className="h-5 w-5" />}
            accent="bg-primary/10 text-primary"
          />
          <StatCard
            title="Successful"
            value={successCount}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={<Clock className="h-5 w-5" />}
            accent="bg-amber-100 text-amber-700"
          />
          <StatCard
            title="Failed"
            value={failedCount}
            icon={<XCircle className="h-5 w-5" />}
            accent="bg-red-100 text-red-700"
          />
        </div>
      )}

      {error && <ErrorAlert message={error} onRetry={refetch} />}

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : payments.length === 0 ? (
        <Empty className="py-20">
          <EmptyMedia variant="icon">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No payments found</EmptyTitle>
          <EmptyDescription>
            {userId
              ? 'No payments have been made with this User ID yet.'
              : 'Set your User ID to view payment history.'}
          </EmptyDescription>
        </Empty>
      ) : (
        <PaymentTable payments={payments} />
      )}
    </div>
  );
}
