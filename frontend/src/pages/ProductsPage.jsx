import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/shared/LoadingState';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { Search, X, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_CATEGORIES } from '@/constants';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const debouncedSearch = useDebounce(search, 350);

  const filter = useMemo(
    () => ({ search: debouncedSearch, category }),
    [debouncedSearch, category]
  );

  const { products, loading, error, refetch } = useProducts(filter);

  // Client-side filtering
  const filtered = useMemo(() => {
    let p = products;
    if (category && category !== 'all') {
      p = p.filter((x) => x.category === category);
    }
    if (priceMax && !isNaN(Number(priceMax))) {
      p = p.filter((x) => x.price <= Number(priceMax));
    }
    if (inStockOnly) {
      p = p.filter((x) => x.stock > 0);
    }
    return p;
  }, [products, category, priceMax, inStockOnly]);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    const params = {};
    if (search) params.search = search;
    if (cat !== 'all') params.category = cat;
    setSearchParams(params);
  };

  const clearAll = () => {
    setSearch('');
    setCategory('all');
    setPriceMax('');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasFilters = search || (category && category !== 'all') || priceMax || inStockOnly;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-52 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5" /> Clear filters
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground hidden sm:block">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex gap-6">
        {/* ─── FILTER SIDEBAR ─── */}
        <aside className="hidden lg:block w-52 shrink-0 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-foreground" />
              <span className="font-heading font-bold text-sm">Filters</span>
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Category</p>
              <button
                onClick={() => handleCategoryClick('all')}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                  category === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                }`}
              >
                All Categories
              </button>
              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                    category === cat ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Max Price (₹)</p>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="h-8 text-sm bg-white"
              />
            </div>

            <Separator className="my-4" />

            {/* Availability */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Availability</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-sm">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* ─── PRODUCT GRID ─── */}
        <div className="flex-1 min-w-0">
          {/* Active filters as pills (mobile) */}
          <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
            {category !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {category}
                <button onClick={() => handleCategoryClick('all')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {inStockOnly && (
              <Badge variant="secondary" className="gap-1">
                In Stock <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
              </Badge>
            )}
          </div>

          {/* Breadcrumb / title */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading font-bold text-lg">
              {category !== 'all' ? category : search ? `Results for "${search}"` : 'All Products'}
            </h1>
            <span className="text-sm text-muted-foreground lg:hidden">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {error && <ErrorAlert message={error} onRetry={refetch} />}

          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : filtered.length === 0 ? (
            <Empty className="py-20">
              <EmptyMedia variant="icon">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No products found</EmptyTitle>
              <EmptyDescription>
                {hasFilters ? 'Try changing your search or filters.' : 'No products available right now.'}
              </EmptyDescription>
              {hasFilters && (
                <Button className="mt-4" onClick={clearAll}>Clear Filters</Button>
              )}
            </Empty>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
