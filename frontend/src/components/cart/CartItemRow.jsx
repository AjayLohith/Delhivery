import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { formatCurrency, getProductImage } from '@/utils/formatters';

/**
 * A single row in the cart table.
 */
export function CartItemRow({ item, onRemove, removing }) {
  return (
    <TableRow>
      {/* Product */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={getProductImage({ id: item.productId, imageUrl: null })}
              alt={item.productName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground line-clamp-1">{item.productName}</p>
            <p className="text-xs text-muted-foreground">ID: {item.productId}</p>
          </div>
        </div>
      </TableCell>

      {/* Unit price */}
      <TableCell className="text-sm">{formatCurrency(item.price)}</TableCell>

      {/* Quantity */}
      <TableCell className="text-center font-medium">{item.quantity}</TableCell>

      {/* Total */}
      <TableCell className="text-sm font-semibold text-primary">
        {formatCurrency(item.totalPrice)}
      </TableCell>

      {/* Remove */}
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.productId)}
          disabled={removing}
          aria-label={`Remove ${item.productName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
