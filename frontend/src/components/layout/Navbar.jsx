import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, ShoppingCart, User, Package, LogIn, Settings } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/hooks/useCart';

const CATEGORIES = [
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Fashion', value: 'Clothing' },
  { label: 'Home & Kitchen', value: 'Home & Kitchen' },
  { label: 'Beauty', value: 'Beauty' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Books', value: 'Books' },
  { label: 'Toys', value: 'Toys' },
];

export function Navbar() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { totalItems } = useCart(userId);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Main bar */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-heading font-extrabold text-2xl text-white tracking-tight mr-2 select-none"
          >
            Delhivery
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything…"
              className="rounded-r-none h-10 bg-white border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              className="rounded-l-none h-10 px-4 bg-amber-400 hover:bg-amber-300 text-foreground border-0 shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            {/* Account dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-primary-foreground/10 h-10 gap-2 px-3">
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden sm:inline">
                    {userId ? userId : 'Sign In'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {userId ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="font-semibold truncate">{userId}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <LogIn className="h-4 w-4 mr-2" /> Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* My Orders quick link */}
            <Button
              variant="ghost"
              className="text-white hover:bg-primary-foreground/10 h-10 gap-1.5 px-3 hidden md:flex"
              onClick={() => navigate('/orders')}
            >
              <Package className="h-4 w-4" />
              <span className="text-sm">Orders</span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              className="text-white hover:bg-primary-foreground/10 h-10 gap-1.5 px-3 relative"
              onClick={() => navigate('/cart')}
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-foreground">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-sm hidden sm:inline">Cart</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="bg-primary/90 border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hidden py-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-primary-foreground/10 shrink-0 text-xs h-7"
              onClick={() => navigate('/products')}
            >
              All Products
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-primary-foreground/10 shrink-0 text-xs h-7"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.value)}`)}
              >
                {cat.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
