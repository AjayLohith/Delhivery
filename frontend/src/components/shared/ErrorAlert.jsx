import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Error alert with optional retry button.
 */
export function ErrorAlert({ message, onRetry }) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4 flex-wrap">
        <span>{message || 'An unexpected error occurred. Please try again.'}</span>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="shrink-0 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
