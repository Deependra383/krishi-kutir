# Krishi Kutir - Organic Superfoods & Microgreens Platform

An e-commerce, catalogue, training, and farm-to-table platform for organic superfood powders, harvested & live microgreens, seeds, and commercial growing kits.

---

## 📁 Codebase Structure

```
├── .env.example                     # Sample environment variables
├── index.html                       # HTML5 entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite + Tailwind CSS configuration
├── metadata.json                    # Application metadata and permissions
│
└── src/
    ├── main.jsx                     # React DOM entry point
    ├── App.jsx                      # Main application component & routing
    ├── index.css                    # Global Tailwind CSS styles
    ├── data.js                      # Curated catalog of products with unique images
    ├── supabase.js                  # Supabase client setup & PostgreSQL SQL Schema
    │
    ├── context/
    │   ├── AuthContext.jsx          # User authentication & Admin role state (Supabase / Local)
    │   ├── ProductContext.jsx       # Product catalog state & CRUD (Supabase / Local)
    │   └── ThemeContext.jsx         # Dark / Light theme mode state
    │
    ├── utils/
    │   └── upi.js                   # Direct UPI VPA and dynamic QR code generation utility
    │
    └── components/
        ├── NavigationBar.jsx        # Sticky top navigation with category links, cart, user profile
        ├── HeroSection.jsx          # Hero banner with call-to-actions
        ├── ProductCatalog.jsx       # Product grid with category filters, search, and details
        ├── ProductCard.jsx          # Individual product card with quantity selector & Add to Cart
        ├── FullPageCart.jsx         # Slide-over / full-page shopping cart with discount & shipping
        ├── CheckoutModal.jsx        # Direct UPI Dynamic QR & COD checkout modal
        ├── MyOrdersSection.jsx      # Order history and real-time live order tracking
        ├── UserProfileModal.jsx     # Customer profile details and recent orders
        ├── AuthModal.jsx            # Sign In / Sign Up modal (Email/Password or Admin Key)
        ├── MicroscopeOverlay.jsx    # Scientific nutritional breakdowns & magnification view
        ├── PartnerWithUsSection.jsx # B2B inquiries & bulk distribution onboarding form
        │
        ├── microgreens/
        │   ├── MicrogreensShowcase.jsx   # Microgreens health benefits and varieties
        │   ├── MicrogreensTraining.jsx   # Commercial workshop & training course enrollment
        │   └── MicrogreensCalculator.jsx # Commercial profit & tray yield calculator
        │
        └── admin/
            ├── AdminDashboard.jsx        # Admin management portal
            ├── AdminHeader.jsx           # Admin top navigation & stats toggle
            ├── AdminKpiBar.jsx           # Revenue, total orders, and catalog KPI metrics
            ├── ProductsTab.jsx           # Catalog CRUD table (Add, Edit, Delete, Reset)
            ├── ProductFormModal.jsx      # Modal form to create or edit products
            ├── OrdersTab.jsx             # Manage order statuses (Pending, Confirmed, Shipped, Delivered)
            ├── PartnerInquiriesTab.jsx   # Review and manage B2B partnership applications
            ├── TrainingInquiriesTab.jsx  # Review training workshop enrollments
            ├── UsersTab.jsx              # Registered users management
            ├── StoreSettingsTab.jsx      # Supabase connection & Direct UPI configuration
            └── LogoCustomizerCard.jsx    # Custom brand logo uploader & visual identity
```

---

## 🛠️ Architecture & Features

1. **State & Database**:
   - **Supabase (PostgreSQL)**: Connected for real-time catalog syncing, customer authentication, and order recording.
   - **Local Storage Fallback**: Runs out of the box even without external credentials by automatically falling back to browser storage.

2. **Payments (0% Platform Fee)**:
   - **Direct UPI & Dynamic QR Codes**: Customers can scan and pay directly to your Google Pay, PhonePe, Paytm, or Bank UPI ID.
   - **Cash on Delivery (COD)**: Available as a checkout option.

3. **Admin Dashboard**:
   - Access with email `admin@krishikutir.com` or the admin master passkey `krishi2026`.
   - Manage products, orders, partner inquiries, training batches, and payment/UPI settings.

---

## 🚀 How to Run Locally

### 1. Prerequisites
Make sure you have installed on your machine:
- **Node.js** (v18.0.0 or higher recommended) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun** / **pnpm** / **yarn**

---

### 2. Setup Project
Open your terminal inside the project directory:

```bash
# 1. Install dependencies
npm install
```

---

### 3. Configure Environment Variables (Optional)
Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

If you wish to connect Supabase:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

> **Note**: If you don't provide Supabase credentials right away, the application **automatically uses LocalStorage fallback** so all product browsing, cart management, checkout, and admin features work immediately!

---

### 4. Start the Local Development Server

```bash
npm run dev
```

The application will start at:
👉 **`http://localhost:3000`** (or the port displayed in your terminal).

Open `http://localhost:3000` in your web browser.

---

### 5. Admin Access
To access the Admin Portal:
1. Click **Admin** or the **User Profile** icon in the navbar.
2. Sign in with:
   - **Admin Email**: `admin@krishikutir.com`
   - **Master Passkey**: `krishi2026`
3. You can also configure your own Merchant UPI ID under **Admin &rarr; Settings &rarr; Direct UPI & Dynamic QR Payments**.

---

### 6. Building for Production

To create an optimized production build:

```bash
npm run build
```

The bundled static assets will be created in the `dist/` directory, ready to deploy to any hosting provider (Vercel, Netlify, Cloud Run, AWS S3, GitHub Pages, etc.).

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Vite dev server at port 3000 |
| **Production Build** | `npm run build` | Compiles and optimizes assets into `dist/` |
| **Preview** | `npm run preview` | Previews the production build locally |
