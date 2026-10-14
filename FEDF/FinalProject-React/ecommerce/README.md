# KL E-Commerce Store — React + Vite

This project follows the supplied student reference: React functional components, `useState`, form `onChange`/`onSubmit`, Local Storage, conditional rendering, `map()`, and CSS Grid. It also keeps the expanded KL store features.

## Run
```bash
npm install
npm run dev
```

## Demo credentials
- Admin username: `admin`
- Admin password: `admin123`
- Demo user: `gogulaakshaya1@gmail.com` / `admin123`
- Demo user: `sindhu@gmail.com` / `sindhu143`

Users can also register a new account.

## Reference-style source structure
```text
src/
├── components/
│   ├── Register.jsx
│   ├── Login.jsx
│   ├── Admin.jsx
│   ├── Products.jsx
│   ├── Header.jsx
│   ├── ProductCard.jsx
│   ├── ProductList.jsx
│   └── Cart.jsx
├── data/
│   └── products.js
├── pages/
│   └── AdminDashboard.jsx
├── App.jsx
├── App.css
├── style.css
└── main.jsx
```

## Features
- Guest browsing, product search and category filters
- Registration, user login, password reset, and logout
- Product cards with consistent width for categories containing 1–2 products
- Cart and order placement
- Admin dashboard with registered users and orders
- Local Storage persistence for demo users and orders

## Security
This is a frontend classroom demo. Local Storage is not secure for real authentication or passwords. A production store should use a backend, password hashing, HTTPS, and proper authorization.
