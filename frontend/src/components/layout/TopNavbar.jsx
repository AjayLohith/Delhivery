import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, Search } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

/**
 * Top navigation bar with search, cart icon, and user avatar.
 */
export function TopNavbar({ onSearch }) {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { totalItems } = useCart(userId);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 shrink-0" />
      <Separator orientation="vertical" className="h-5" />

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            className="pl-9 h-8 text-sm bg-muted/40 border-transparent focus:border-border focus:bg-background"
            value={query}
            onChange={handleSearch}
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        {/* Cart button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          onClick={() => navigate('/cart')}
          aria-label="Shopping cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>

        {/* User avatar */}
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
            {userId ? userId.slice(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
