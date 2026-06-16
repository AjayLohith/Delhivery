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
    <div className="space-y-0">
      {tracking.map((event, index) => {
        const IconComponent = STATUS_ICONS[event.status] || Clock;
        const colorClass = STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800 border-gray-200';
        const isLast = index === tracking.length - 1;

        return (
          <div key={event.id || index} className="relative">
            {/* Timeline connector line */}
            {!isLast && (
              <div className="absolute left-6 top-14 w-0.5 h-12 bg-border" />
            )}

            <Card className="border-l-4 border-l-primary">
              <CardContent className="flex gap-4 p-4">
                {/* Icon circle */}
                <div className="flex shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass} border`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <Badge variant="outline" className={`text-xs font-semibold ${colorClass}`}>
                        {event.status}
                      </Badge>
                      {event.description && (
                        <p className="text-sm text-foreground mt-1 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
