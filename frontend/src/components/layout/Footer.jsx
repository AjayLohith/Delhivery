import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCw, HeartHandshake } from 'lucide-react';

const TRUST = [
  { icon: Truck, title: 'Pan-India Delivery', sub: 'Delivered in 24–48 hours' },
  { icon: ShieldCheck, title: '100% Secure Payments', sub: 'SSL encrypted checkout' },
  { icon: RefreshCw, title: 'Easy 7-Day Returns', sub: 'Hassle-free return policy' },
  { icon: HeartHandshake, title: '24/7 Customer Support', sub: 'We\'re always here to help' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/60 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <p className="font-heading font-extrabold text-lg text-primary mb-3">Delhivery</p>
          <p className="text-xs text-white/60 leading-relaxed">
            India's fastest growing e-commerce platform. Shop smarter, delivered faster.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Shop</p>
          <ul className="space-y-1.5">
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'].map((c) => (
              <li key={c}>
                <Link
                  to={`/products?category=${encodeURIComponent(c)}`}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Account</p>
          <ul className="space-y-1.5">
            {[
              { label: 'My Orders', to: '/orders' },
              { label: 'My Cart', to: '/cart' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-xs text-white/60 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Help</p>
          <ul className="space-y-1.5">
            {['Contact Us', 'Track Order', 'Return Policy', 'FAQs'].map((item) => (
              <li key={item}>
                <span className="text-xs text-white/60 cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Delhivery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
