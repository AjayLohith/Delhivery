# EcomDash — React Frontend

A modern, responsive SaaS-style dashboard for the E-Commerce Microservices platform.

## Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | React 19 + Vite 8                   |
| Language       | JavaScript (JSX)                    |
| Styling        | Tailwind CSS v4                     |
| UI Components  | shadcn v4 (Radix UI primitives)     |
| Routing        | React Router v7                     |
| HTTP Client    | Axios                               |
| Fonts          | Montserrat (headings) + DM Sans (body) |
| Icons          | Lucide React                        |
| Notifications  | Sonner (toast)                      |

---

## Getting Started

### Prerequisites

- Node.js 20.19+
- Java microservices running (see `ecom/README.md`)

### Install & Run

```bash
cd ecom/ecom-frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> On first visit, you'll be prompted to enter a **User ID** (e.g. `user123`). This is used to identify your cart and payment history. It's stored in `localStorage`.

---

## Pages

| Route       | Page                  | Description                                         |
| ----------- | --------------------- | --------------------------------------------------- |
| `/`         | Dashboard             | KPI stats, quick actions, recent payments           |
| `/products` | Product Catalog       | Browse, search, filter by category, add to cart     |
| `/cart`     | Shopping Cart         | View items, remove items, place order with email    |
| `/payments` | Payment History       | Payment stats, expandable rows with Razorpay detail |
| `/admin`    | Admin — Products      | Create, edit, delete products; search & filter      |

---

## Architecture

```
src/
├── assets/                  # Static assets
├── components/
│   ├── ui/                  # shadcn auto-generated components (TSX)
│   ├── layout/              # AppLayout, AppSidebar, TopNavbar
│   ├── products/            # ProductCard, ProductFilters, ProductForm
│   ├── cart/                # CartItemRow
│   ├── payments/            # PaymentTable
│   └── shared/              # Typography, StatCard, StatusBadge,
│                            #   LoadingState, ErrorAlert, UserIdPrompt
├── context/
│   └── UserContext.jsx      # userId / userEmail — stored in localStorage
├── hooks/
│   ├── useProducts.js       # Fetch products + CRUD mutations
│   ├── useCart.js           # Cart state management
│   ├── usePayments.js       # Payment history
│   └── useDebounce.js       # Debounce helper
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── CartPage.jsx
│   ├── PaymentsPage.jsx
│   └── AdminProductsPage.jsx
├── services/
│   ├── api.js               # Axios instance (base URL + error interceptor)
│   ├── productService.js
│   ├── cartService.js
│   └── paymentService.js
├── constants/index.js       # API base URL, status enums, categories
├── utils/formatters.js      # Currency (INR), date, truncate helpers
├── App.jsx                  # Router, providers
└── main.jsx                 # Entry point
```

### Key Design Decisions

- **JavaScript over TypeScript** — All custom app code is `.jsx`/`.js`. The shadcn generated UI components stay as `.tsx` since they are auto-generated.
- **Context for user identity** — No auth system exists. A lightweight `UserContext` persists `userId` and `userEmail` in `localStorage`. First-visit modal collects this.
- **Custom hooks for data** — Each feature has a dedicated hook (`useProducts`, `useCart`, `usePayments`) that handles loading, error, and data state.
- **Optimistic UI for cart** — Removing an item updates the local list immediately, then confirms with the backend.
- **Debounced search** — 350 ms debounce prevents excessive API calls while typing.
- **Error boundary** — Every data-fetching section renders an `<ErrorAlert>` with a retry button on API failure, and an `<Empty>` component for no-data states.

### Design System

| Token          | Value                         | Usage                        |
| -------------- | ----------------------------- | ---------------------------- |
| Primary        | `#4169E1` (Royal Blue)        | Buttons, active nav, badges  |
| Background     | `#FFFFFF`                     | Page background              |
| Surface/Muted  | `#F7F7F7` (Bright Snow)       | Cards, table headers         |
| Foreground     | `#1B1B1B` (Carbon Black)      | Main text                    |
| Heading font   | Montserrat Variable (700/800) | All headings                 |
| Body font      | DM Sans                       | All body/UI text             |
| Border radius  | `0.75rem`                     | Cards, inputs, dialogs       |

---

## API Integration

All requests go through the API Gateway at **`http://localhost:8080`**.

| Service  | Endpoints used                                                                        |
| -------- | ------------------------------------------------------------------------------------- |
| Products | `GET /api/products`, `POST`, `PUT /{id}`, `DELETE /{id}`, search, category, in-stock |
| Cart     | `GET /api/cart/{userId}`, add, remove, clear, checkout                                |
| Payments | `GET /api/payment/user/{userId}`, `GET /api/payment/order/{orderId}`                  |

---

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build
```
