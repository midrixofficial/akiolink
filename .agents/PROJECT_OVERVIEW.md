# PROJECT.md

# Merchant Ordering Platform

## Project Goal

Build a complete merchant ordering platform where sellers (merchants) can create an account, manage products, generate a public ordering link, and receive customer orders.

The platform must support:

- Merchant registration and authentication
- Product management
- Category management (optional categories)
- Shareable ordering link
- Customer ordering experience
- Order tracking
- Analytics dashboard
- Settings and support system

The system should prioritize:

1. Mobile-first customer experience
2. Fast merchant operations
3. Clean API architecture
4. Scalability
5. Maintainable code

---

# Tech Stack

## Backend

Framework:
- Laravel 13

Responsibilities:
- Authentication
- API management
- Database
- Business logic
- Validation
- Queue jobs
- Notifications
- Order processing
- Link generation

Architecture:
- REST API
- Service Layer
- Repository Pattern (only where needed)
- Laravel Policies
- Laravel Resources
- Event Driven where beneficial

---

## Merchant Frontend

Framework:
- React

Responsibilities:
- Merchant dashboard
- Product management
- Category management
- Analytics
- Orders
- Settings

Requirements:
- SPA
- Responsive
- Fast navigation
- Component driven

Preferred:
- React Router
- React Query
- Zustand
- Axios
- Tailwind CSS

---

## Customer Frontend

Framework:
- Svelte

Responsibilities:
- Product browsing
- Categories
- Cart
- Checkout
- Order confirmation

Requirements:
- Mobile-first
- Lightweight
- Fast load
- SEO friendly

Preferred:
- SvelteKit style routing if applicable
- Tailwind CSS

---

# Project Directory Structure

The project is built as a single integrated Laravel + Vite application. Both frontends are compiled inside the Laravel resource folder.

```plaintext
root/
│
├── app/                        # Laravel Backend (Controllers, Models, Providers, etc.)
│   ├── Http/Controllers/       # Auth, Product, Category, Merchant, Support, Order Controllers
│   └── Models/                 # Eloquent Models (User, Merchant, Category, Product, Order, OrderItem, Support, SupportReply)
│
├── routes/                     # Laravel Routing (web.php, api.php)
├── database/                   # Migrations and Seeds
│
├── resources/                  # Frontend Resources
│   ├── css/                    # Global stylesheet & Tailwind CSS configurations
│   ├── views/                  # Blade templates (welcome.blade.php for React Merchant app, customer.blade.php for Svelte Storefront app)
│   │
│   ├── js/                     # Merchant Panel React SPA
│   │   ├── main.jsx            # Entry point
│   │   ├── App.jsx             # Shell & custom navigation logic
│   │   ├── pages/              # Panel Pages (Dashboard, Category, Product, Orders, Support, Settings, Profile, MerchantDetails, etc.)
│   │   ├── components/         # Shared React UI components
│   │   └── lib/                # React utility helpers
│   │
│   └── svelte/                 # Customer Storefront Svelte App
│       ├── app.js              # Svelte Bootstrapping
│       ├── App.svelte          # Storefront Single-Page View (Home Menu, Cart, Checkout, Success Modal)
│       ├── components/         # Svelte components (FoodCard.svelte)
│       └── lib/                # Svelte state stores (brand.js, cart.js, products.js)
│
├── public/                     # Publicly accessible assets
├── storage/                    # Uploaded files and logs
└── tests/                      # PHPUnit tests
```

---

# Core Roles

## Merchant

Can:

- Register
- Login
- Manage profile
- Add products
- Create categories
- Edit products
- Delete products
- Generate customer links
- View orders
- View analytics
- Manage settings
- Contact support

---

## Customer

Can:

- Open merchant link
- Browse products
- Filter categories
- Add to cart
- Checkout
- Confirm order

Cannot:

- Login
- Access merchant panel
- Modify products

---

# Application Flow

## Merchant Journey

Register
↓

Login
↓

Complete Merchant Details
↓

Create Categories (optional)
↓

Create Products
↓

Generate Customer Link
↓

Share Link
↓

Receive Orders
↓

Track Orders
↓

View Dashboard Analytics

---

## Customer Journey

Open Merchant Link
↓

View Merchant Store
↓

Browse Products
↓

Select Products
↓

Add To Cart
↓

Checkout
↓

Confirm Order
↓

Order Created

---

# Authentication

Laravel handles all authentication.

Authentication:
- Laravel Sanctum

Protected:
- Merchant APIs

Public:
- Customer ordering APIs

Session Flow:

Merchant
→ Login
→ Receive Token
→ Store Securely
→ Use API

Customer
→ Anonymous Session

---

# Database Design

## users (Auth & Account)
```plaintext
id (bigint, PK)
name (string)
email (string, unique)
mobile (string, nullable)
password (string, hashed)
remember_token (string, nullable)
created_at (timestamp)
updated_at (timestamp)
```

---

## merchants (Store Settings & Parameters)
```plaintext
id (bigint, PK)
user_id (bigint, FK users.id)
name (string)
business_name (string)
business_mobile (string, nullable)
business_email (string, nullable)
business_address (text, nullable)
store_status (string: open, closed)
auto_accept (boolean)
prep_time (integer)
currency (string)
tax_rate (decimal)
min_order_value (decimal)
delivery_charge (decimal)
timezone (string)
created_at (timestamp)
updated_at (timestamp)
```

---

## categories
```plaintext
id (bigint, PK)
merchant_id (bigint, FK merchants.id)
name (string)
description (string, nullable)
image (string, nullable)
order_by (integer, default 0)
created_at (timestamp)
updated_at (timestamp)
```

---

## products
```plaintext
id (bigint, PK)
merchant_id (bigint, FK merchants.id)
category_id (bigint, FK categories.id, nullable)
name (string)
description (text, nullable)
short_description (string, nullable)
sku (string, nullable)
type (string, e.g. veg, nonveg)
unit (string, e.g. piece, plate)
weight (decimal, nullable)
quantity_value (decimal, nullable)
quantity_unit (string, nullable)
price (decimal)
discount_price (decimal, nullable)
cost_price (decimal, nullable)
stock_quantity (integer)
min_stock_alert (integer)
track_stock (boolean)
is_available (boolean)
is_featured (boolean)
image (string, nullable)
gallery (json, array of secondary images)
tags (string, nullable)
created_at (timestamp)
updated_at (timestamp)
```

---

## orders
```plaintext
id (bigint, PK)
user_id (bigint, FK users.id, representing the merchant owning the order)
order_number (string)
customer_name (string)
customer_email (string, nullable)
customer_phone (string)
delivery_address (text)
total_amount (decimal)
status (string: Pending, Completed, Cancelled, On Progress, On Hold)
created_at (timestamp)
updated_at (timestamp)
```

---

## order_items
```plaintext
id (bigint, PK)
order_id (bigint, FK orders.id)
product_id (bigint, FK products.id, nullable)
product_name (string)
quantity (integer)
price (decimal)
created_at (timestamp)
updated_at (timestamp)
```

---

## supports (Support Tickets)
```plaintext
id (bigint, PK)
user_id (bigint, FK users.id)
subject (string)
category (string)
message (text)
status (string: Open, In Progress, Resolved, Closed)
created_at (timestamp)
updated_at (timestamp)
```

---

## support_replies
```plaintext
id (bigint, PK)
support_id (bigint, FK supports.id)
user_id (bigint, FK users.id, author of reply)
message (text)
created_at (timestamp)
updated_at (timestamp)
```


---

# Merchant Panel Pages

## Dashboard

Features:
- Total Orders
- Today's Orders
- Revenue
- Recent Orders
- Charts
- Performance Summary

---

## Categories

Features:
- Create
- Edit
- Delete
- Search
- Pagination

Rules:
- Category optional

---

## Products

Features:
- Create
- Edit
- Delete
- Upload Images
- Search
- Filter

Rules:
- Product can exist without category

---

## Merchant Details

Fields:
- Business Name
- Phone
- Email
- Logo
- Address

---

## Generate Link

Features:
- Create public ordering URL
- Enable/Disable
- Copy Link
- QR Support (future)

Example:
```plaintext
domain.com/{merchant_slug}
(e.g., domain.com/the-vellore-kitchen)
```

---

## Orders

Features:
- List Orders
- Search
- Filter
- Status Updates

Statuses:

```plaintext
Pending
Confirmed
Completed
Cancelled
```

---

## Settings

Features:
- Account
- Notifications
- Theme
- Security

---

## Support

Features:
- Create Request
- Track Request
- Feature Requests

---

# Customer Panel Pages

## Product List

Features:
- Merchant Info
- Categories
- Product Grid

---

## Product Detail

Features:
- Product Information
- Add To Cart

---

## Cart

Features:
- Quantity
- Remove
- Summary

---

## Checkout

Fields:
- Customer Name
- Phone

Actions:
- Confirm Order

---

## Order Confirmation

Display:
- Order Number
- Status
- Merchant Contact

---

# API Rules

Base:

```plaintext
/api
```

Version:

```plaintext
/api/v1
```

Response:

Success:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

Error:

```json
{
  "success": false,
  "message": "",
  "errors": {}
}
```

---

# Development Rules

AI MUST:

- Follow existing folder structure
- Never duplicate logic
- Create reusable components
- Use API services
- Use validation
- Write readable code
- Prefer composition over duplication
- Maintain responsiveness
- Keep customer pages optimized

AI MUST NOT:

- Add libraries without approval
- Break existing APIs
- Mix merchant and customer code
- Add inline styles
- Hardcode URLs
- Put business logic in UI

---

# UI Principles

Merchant:
- Professional
- Data dense
- Fast workflows

Customer:
- Simple
- Mobile optimized
- Minimal clicks

---

# Performance Goals

Dashboard:
< 2s

Customer Load:
< 1s

API:
< 300ms average

Image:
Lazy load

---

# Security

- Validate all inputs
- Authorization checks
- Rate limiting
- XSS protection
- CSRF protection
- Secure uploads

---

# Testing

Backend:
- PHPUnit

Frontend:
- Vitest

Coverage Target:
80%

---

# Future Features

Phase 2:
- QR ordering
- WhatsApp ordering
- Payment gateway
- Coupons
- Delivery tracking
- Inventory
- Analytics exports

Phase 3:
- Multi-store merchant
- Customer accounts
- Subscription plans

---

# Definition Of Done

Feature is complete only if:

- Backend implemented
- API documented
- Frontend completed
- Validation added
- Responsive verified
- Tested
- Error states handled
- Loading states handled

---

# AI Execution Instructions

Whenever implementing features:

1. Read this file first
2. Respect architecture
3. Reuse existing modules
4. Preserve API contracts
5. Update documentation
6. Never assume requirements
7. Ask before structural changes

End Goal:

Deliver a scalable merchant ordering platform with Laravel + React + Svelte that remains maintainable as features grow.