import { Card, CardContent } from '@/components/ui/card';
import { HeadingMD, MutedText } from './Typography';

/**
 * Stat card for dashboard KPIs.
 * @param {string} title
 * @param {string|number} value
 * @param {ReactNode} icon
 * @param {string} accent - tailwind bg class for the icon circle, e.g. 'bg-primary/10 text-primary'
 * @param {string} trend - optional trend text
 */
export function StatCard({ title, value, icon, accent = 'bg-primary/10 text-primary', trend }) {
  return (
    <Card className="card-elevated">
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="flex flex-col gap-1">
          <MutedText>{title}</MutedText>
          <HeadingLG className="mt-1 text-2xl">{value}</HeadingLG>
          {trend && <span className="text-xs text-muted-foreground mt-1">{trend}</span>}
        </div>
        {icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HeadingLG({ children, className = '' }) {
  return <h2 className={`heading-lg ${className}`}>{children}</h2>;
}
