# 🛒 ShopNow — Full-Stack E-Commerce Web Application

A production-ready full-stack e-commerce application built with **React**, **Node.js/Express**, and **MongoDB**. Features a complete shopping experience with product management, cart, checkout, order tracking, and a role-based admin dashboard.

---

## 🚀 Live Features

- 🛍️ Product catalog with search, filter by category, sort, and pagination
- 🔐 JWT-based authentication with role-based access (Admin / User)
- 🛒 Persistent cart with quantity management and local storage sync
- 💳 Checkout with shipping address, payment method selection, GST & shipping calculation
- 📦 Order placement, tracking, and cancellation
- ⭐ Product reviews and star ratings
- 🧑‍💼 Admin dashboard — manage products, orders, and users
- 📊 Order status progression tracker (Processing → Confirmed → Shipped → Delivered)
- 💰 Indian Rupee (₹) formatting with 18% GST applied automatically
- 🌑 Dark-themed responsive UI

---

## 🗂️ Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile, user management
│   │   ├── productController.js   # CRUD, reviews, featured products
│   │   └── orderController.js     # Place, track, cancel, update orders
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt hashing
│   │   ├── Product.js             # Product schema with reviews sub-doc
│   │   └── Order.js               # Order schema with items + status
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── cartRoutes.js
│   ├── seeder.js                  # Seeds 12 products + 2 demo users
│   ├── server.js                  # Express app entry point
│   ├── .env                       # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.js / Navbar.css
        │   │   └── Footer.js / Footer.css
        │   └── products/
        │       ├── ProductCard.js / ProductCard.css
        │       └── AdminProductForm.js
        ├── context/
        │   ├── AuthContext.js     # Global auth state
        │   └── CartContext.js     # Cart state with localStorage sync
        ├── pages/
        │   ├── Home.js            # Hero, categories, featured products
        │   ├── Products.js        # Catalog with filters
        │   ├── ProductDetail.js   # Product page + reviews
        │   ├── Cart.js            # Cart with subtotal/tax/shipping
        │   ├── Checkout.js        # Address + payment form
        │   ├── Orders.js          # User's order history
        │   ├── OrderDetail.js     # Order detail + progress tracker
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Profile.js
        │   └── admin/
        │       ├── AdminDashboard.js
        │       ├── AdminProducts.js
        │       ├── AdminOrders.js
        │       └── AdminUsers.js
        ├── services/
        │   └── api.js             # Axios instance + all API calls
        ├── styles/
        │   └── global.css         # Design tokens, utility classes
        ├── App.js
        └── index.js
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18, React Router v6, Axios     |
| Styling    | Custom CSS with CSS variables (dark theme) |
| State      | React Context API (Auth + Cart)      |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB with Mongoose ODM            |
| Auth       | JWT (jsonwebtoken) + bcryptjs        |
| Toasts     | react-hot-toast                      |
| Dev Tools  | Nodemon                              |

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Git

> On Chromebook (Linux/Crostini), install Node.js via:
> ```bash
> curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
> sudo apt-get install -y nodejs
> ```

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-app.git
cd ecommerce-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

> **MongoDB Atlas:** Replace `MONGO_URI` with your Atlas connection string.

Start MongoDB locally (Chromebook/Ubuntu):

```bash
sudo systemctl start mongod
# or if using mongod directly:
sudo mongod --dbpath /var/lib/mongodb
```

Seed the database with sample products and users:

```bash
node seeder.js
```

Start the backend server:

```bash
npm run dev       # development (with nodemon)
# or
npm start         # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

The React app proxies API requests to `http://localhost:5000` via the `"proxy"` field in `package.json`.

---

## 🔑 Demo Credentials

After running the seeder:

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@store.com      | admin123   |
| User  | john@example.com     | user123    |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Access   | Description            |
|--------|-----------------------|----------|------------------------|
| POST   | /api/auth/register    | Public   | Register new user      |
| POST   | /api/auth/login       | Public   | Login                  |
| GET    | /api/auth/profile     | User     | Get own profile        |
| PUT    | /api/auth/profile     | User     | Update profile         |
| GET    | /api/auth/users       | Admin    | Get all users          |
| DELETE | /api/auth/users/:id   | Admin    | Delete user            |

### Products
| Method | Endpoint                    | Access   | Description            |
|--------|-----------------------------|----------|------------------------|
| GET    | /api/products               | Public   | Get all products (filter/sort/page) |
| GET    | /api/products/featured      | Public   | Get featured products  |
| GET    | /api/products/:id           | Public   | Get single product     |
| POST   | /api/products               | Admin    | Create product         |
| PUT    | /api/products/:id           | Admin    | Update product         |
| DELETE | /api/products/:id           | Admin    | Delete product         |
| POST   | /api/products/:id/reviews   | User     | Add review             |

### Orders
| Method | Endpoint                    | Access   | Description            |
|--------|-----------------------------|----------|------------------------|
| POST   | /api/orders                 | User     | Place new order        |
| GET    | /api/orders/my-orders       | User     | Get own orders         |
| GET    | /api/orders/:id             | User     | Get order by ID        |
| GET    | /api/orders                 | Admin    | Get all orders         |
| PUT    | /api/orders/:id/status      | Admin    | Update order status    |
| PUT    | /api/orders/:id/cancel      | User     | Cancel order           |
| GET    | /api/orders/stats           | Admin    | Order statistics       |

---

## 🧑‍💼 Admin Features

- View total orders, revenue, and status breakdown
- Add, edit, and delete products
- Update order status (Processing → Confirmed → Shipped → Delivered)
- Mark payments as paid/pending
- View and manage all registered users

Access the admin panel at `/admin` after logging in with an admin account.

---

## 💡 Key Implementation Details

- **Stock management:** Stock is decremented on order placement and restored on cancellation
- **Free shipping:** Automatically applied on orders over ₹500
- **GST:** 18% tax calculated server-side on order creation
- **JWT expiry:** Tokens valid for 7 days
- **Admin bootstrap:** First user registered with `role: admin` becomes admin (when no admin exists)
- **Cart:** Stored in `localStorage`, synced via React Context
- **Reviews:** One review per user per product, enforced server-side

---

## 🌐 Deployment Notes

For deployment (e.g., Render + MongoDB Atlas):

1. Set environment variables on the hosting platform
2. Build the React frontend: `cd frontend && npm run build`
3. Serve the build folder from Express (add static middleware in `server.js`)
4. Update `MONGO_URI` to your Atlas connection string

---

## 📸 Screenshots

> Add screenshots of your app here after running it locally.
> Example: Home page, Product catalog, Cart, Checkout, Admin dashboard.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 👩‍💻 Author

**Rathi Varshini R**  
B.E. Artificial Intelligence & Machine Learning  
[GitHub](https://github.com/RathiVarshiniR)
