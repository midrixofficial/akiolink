# Flow And Conventions

## API Flow (Current)
Defined in `routes/api.php`.

### Public Auth Endpoints
- `POST /api/auth/signup` - Register an account (automatically creates user and associated merchant profile)
- `POST /api/auth/signin` - Authenticate user credentials and return Sanctum token

### Authenticated Auth Endpoints (`auth:sanctum`)
- `POST /api/auth/signout` - Revoke current Sanctum token
- `GET /api/auth/me` - Get current authenticated user details
- `POST /api/auth/profile/update` - Update name and mobile number on User profile
- `POST /api/auth/profile/password` - Update account password

### Public Product & Order Endpoints (Customer Storefront)
- `GET /api/open/products` - List available products, supports filtering by `merchant_id`, `category_id`, `type`, featured status, and text search
- `GET /api/open/products/{id}` - View individual available product details
- `POST /api/open/orders` - Place a customer order from Svelte Storefront

### Authenticated Resource Endpoints (Merchant Panel)
- Categories:
  - `POST /api/categories/reorder` - Reorder active categories
  - REST `apiResource('categories', ...)`
- Products:
  - REST `apiResource('products', ...)`
- Merchant Profile & Settings:
  - `GET /api/merchant` - Get current merchant settings (auto-creates if missing)
  - `POST /api/merchant/update` - Update store settings (business name, mobile, address, taxes, currency, preparation time, etc.)
- Support Tickets:
  - `GET /api/support/tickets` - List merchant's support tickets
  - `POST /api/support/tickets` - Open a new support ticket
  - `POST /api/support/tickets/{id}/reply` - Reply to an open ticket
- Orders:
  - `GET /api/orders` - List customer orders belonging to this merchant (auto-seeds mock orders if total count is 0)
  - `GET /api/orders/{id}` - View order details and attached items
  - `POST /api/orders/{id}/status` - Update order status (Pending, On Progress, On Hold, Completed, Cancelled)

---

## Front-End Core Mechanics & Flow

### React Merchant UI Shell & Custom Navigation
- **Shell Layout**: Sidebar + Header + page content defined in `resources/js/App.jsx`.
- **Navigation Logic**: The React frontend uses a **custom state-based router** instead of standard React Router.
  - A custom `navigate(path)` function handles updating `currentPath` state and pushing state to browser history (`window.history.pushState`).
  - Active page components are conditionally rendered inside `renderPage()` matching the current `currentPath` state.
  - Listeners for `popstate` synchronize page renders when back/forward is clicked.
  - The `menuByPath` dictionary maps active paths to selected menus to drive header breadcrumbs and selected sidebar states.

### Svelte Storefront SPA
- **Unified SPA**: Svelte storefront lives in `resources/svelte/App.svelte`.
- **Global Injection**: The blade view `customer.blade.php` embeds `window.merchantSlug` representing the current slug.
- **State Stores**: State is managed in lightweight Svelte reactive stores (`resources/svelte/lib/`):
  - `brand.js`: Holds active store details (colors, name, categories, products) and parses customizing URL parameters (`brandName`, `brandColor`, `brandAddress`, `themeMode`) for real-time live Svelte previews.
  - `cart.js`: Stores cart items, quantities, subtotal, and tax calculations.
  - `products.js`: Direct storefront products repository.

---

## Styling & Design Conventions
- **Dual-Theme Support**: Preserve dual-theme (light and dark modes) on all elements. New styles must add light classes as default and dark overrides with `dark:*` prefixes.
- **Color Consistency**: Follow the existing premium HSL/hex color configurations. Do not hardcode arbitrary aesthetic definitions or mix design systems in isolated files.

---

## Editing Conventions For Agents
- **Minimal Modifications**: Write concise, targeted edits. Reuse existing classes, hooks, and utilities.
- **Prop Alignment**: Keep prop names, interfaces, and API payload contracts consistent.
- **Clean Up**: Always clean up unused imports, styles, and variables when removing or modifying components.
- **Sync Nav & Paths**: If updating page endpoints, ensure you synchronize `menuByPath`, sidebar highlights, and the `renderPage()` router matchers together.

