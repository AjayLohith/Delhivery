import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Home,
  AlertCircle 
} from 'lucide-react';

const STATUS_ICONS = {
  'ORDER PLACED': Package,
  'PAYMENT CONFIRMED': CheckCircle2,
  'PAYMENT FAILED': AlertCircle,
  'PROCESSING': Clock,
  'SHIPPED': Truck,
  'DELIVERED': Home,
};

const STATUS_COLORS = {
  'ORDER PLACED': 'bg-blue-100 text-blue-800 border-blue-200',
  'PAYMENT CONFIRMED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'PAYMENT FAILED': 'bg-red-100 text-red-800 border-red-200',
  'PROCESSING': 'bg-amber-100 text-amber-800 border-amber-200',
  'SHIPPED': 'bg-purple-100 text-purple-800 border-purple-200',
  'DELIVERED': 'bg-green-100 text-green-800 border-green-200',
};

/**
 * Timeline component for displaying order tracking updates.
 */
export function OrderTrackingTimeline({ tracking = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!tracking || tracking.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
          <Clock className="h-5 w-5 mr-2" />
          <span>No tracking information yet</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 ml-4">
      {tracking.map((event, index) => {
        const IconComponent = STATUS_ICONS[event.status] || Clock;
        const isLast = index === tracking.length - 1;
        const isCompleted = true; // Assuming history means it's completed

        return (
          <div key={event.id || index} className="relative pl-6">
            {/* Timeline connector line */}
            {!isLast && (
              <div className="absolute left-[0.55rem] top-7 w-0.5 h-[calc(100%+1.5rem)] bg-border" />
            )}

            {/* Timeline dot */}
            <div className={`absolute left-0 top-1.5 h-[1.3rem] w-[1.3rem] rounded-full border-2 border-white flex items-center justify-center
              ${isCompleted ? 'bg-primary' : 'bg-muted'}
            `}>
               {/* inner dot */}
               <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {event.status}
                </p>
                {event.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {formatDate(event.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
