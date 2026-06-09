import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserProvider } from '@/context/UserContext';
import { UserIdPrompt } from '@/components/shared/UserIdPrompt';
import { ShopLayout } from '@/components/layout/ShopLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { AdminProductsPage } from '@/pages/AdminProductsPage';

export default function App() {
  return (
    <UserProvider>
      <TooltipProvider>
        <BrowserRouter>
          {/* Prompt user for their ID on first visit */}
          <UserIdPrompt />

          <Routes>
            <Route element={<ShopLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin" element={<AdminProductsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <Toaster position="bottom-right" richColors />
      </TooltipProvider>
    </UserProvider>
  );
}
