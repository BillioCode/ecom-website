# E-Commerce Store (MERN Stack)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Project Overview

This project is a full-stack e-commerce application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It's developed primarily for **study purposes** to demonstrate a modern web application with user authentication, product management, cart functionality, payment integration, and analytics.

## ✨ Features

- **User Authentication:** Secure signup, login, logout, and token refresh system with JWTs and HttpOnly cookies.
- **Product Catalog:** Browse, search, and view product details.
- **Shopping Cart:** Add, remove, and update quantities of products in the cart.
- **Admin Dashboard:**
  - Create, delete, and manage products.
  - Toggle product "featured" status.
  - View analytics data (total users, products, sales, revenue).
  - Monitor daily sales trends.
- **Payment Integration:** Seamless checkout experience using Stripe.
- **Coupon System:** Apply discount coupons during checkout.
- **Caching:** Utilizes Redis for caching featured products and refresh tokens to improve performance.
- **Cloud Storage:** Product images are handled via Cloudinary.
- **Responsive Design:** Optimized for various screen sizes.

## 🛠️ Technologies Used

### Frontend

- **React.js:** A JavaScript library for building user interfaces.
- **React Router DOM:** For client-side routing.
- **Zustand:** A fast, small, and scalable barebones state-management solution.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Framer Motion:** A library for production-ready animations.
- **Axios:** Promise-based HTTP client for the browser and Node.js.
- **Recharts:** Composable charting library built on React components.

### Backend

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose:** MongoDB object modeling for Node.js.
- **Bcryptjs:** For password hashing and security.
- **JSON Web Token (jsonwebtoken):** For secure user authentication.
- **Cookie-Parser:** Middleware to parse cookies.
- **Dotenv:** Loads environment variables from a `.env` file.
- **Nodemon:** Utility that automatically restarts the Node.js application when file changes are detected (for development).

### Database

- **MongoDB:** A NoSQL, document-oriented database.

### Caching/Session Management

- **Redis (via `ioredis`):** An open-source, in-memory data structure store, used for caching and managing refresh tokens.

### Cloud Services

- **Cloudinary:** Cloud-based image and video management.
- **Stripe:** Payment processing platform.

## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A MongoDB database (local or cloud-hosted like MongoDB Atlas)
- A Redis instance (local or cloud-hosted like Upstash Redis)
- A Cloudinary account
- A Stripe account (for testing payments)

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd e-commerce-store # or whatever your project's root folder is named
```
