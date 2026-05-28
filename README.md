# Merchant Ordering Platform (Akiolink)

Welcome to Akiolink, a complete restaurant and merchant ordering platform where sellers can manage products, categories, customized branding, view analytics, and generate a dynamic public ordering link for customers.

## Tech Stack
* **Backend**: Laravel 13 (REST API, Sanctum Auth, SQLite/MySQL, Eloquent)
* **Merchant Panel**: React SPA (unified inside Laravel at `resources/js/` with custom state-based history navigation)
* **Customer Storefront**: Svelte SPA (unified inside Laravel at `resources/svelte/`)

---

## 🤖 For AI Coding Agents (Cursor, Windsurf, Copilot, Antigravity)
This repository contains a dedicated **AI Agent Context Pack** to guarantee 100% architectural alignment and prevent drift. Before you modify any code, **you must read these files in order**:

1. [PROJECT_OVERVIEW.md](file:///.agents/PROJECT_OVERVIEW.md) — Platform goals, directory mapping, and exact database schemas.
2. [FLOW_AND_CONVENTIONS.md](file:///.agents/FLOW_AND_CONVENTIONS.md) — Backend routing list, React routing mechanics, Svelte reactive stores, and dual-theme CSS rules.
3. [TASK_CHECKLIST.md](file:///.agents/TASK_CHECKLIST.md) — Safety guidelines and quality gate checks to complete before finishing a task.

---

## Getting Started

### Prerequisites
* PHP >= 8.2
* Composer
* Node.js & npm

### Installation & Development
1. Clone the repository and run setup commands:
   ```bash
   composer install
   npm install
   ```
2. Create your `.env` file:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Run migrations and database seeding:
   ```bash
   php artisan migrate --seed
   ```
4. Start the Laravel server and Vite development compiler:
   ```bash
   php artisan serve & npm run dev
   ```
