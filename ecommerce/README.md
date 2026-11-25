# KL E-Commerce Store

A React + Vite shopping application developed as a three-member team project. The application demonstrates registration and login, product discovery, cart operations, checkout, order tracking and basic store administration.

## Run the project

1. Extract the ZIP file.
2. Open the extracted `KL-Ecommerce-Complete` folder in VS Code.
3. Open a terminal in that folder.
4. Run `npm install`.
5. Run `npm run dev` and open the local URL shown by Vite.

## Team responsibilities

### Member 1 – Authentication & Checkout
- User registration, login and logout
- Admin login
- Password visibility toggle and form validation
- Display the logged-in user's name
- Delivery address form and order summary
- Quantity and price calculation
- Cash on Delivery and clearly labelled demo payment option
- Place Order and order confirmation
- My Orders with order status tracking

### Member 2 – Admin Module
- Admin dashboard
- Registered user details
- Total orders, order value and completed-order revenue
- Customer order and delivery details
- Update order status: Pending, Processing, Completed or Cancelled
- Basic sales overview

### Member 3 – Shopping Module
- Product listing and product details
- Product search and category filtering
- Price and name sorting
- Shopping cart with quantity controls
- Wishlist

## Demo credentials

- **Admin:** username `admin`, password `admin123`
- **Demo user:** `gogulaakshaya1@gmail.com`, password `admin123`
- **Demo user:** `sindhu@gmail.com`, password `sindhu143`

You can also register a new user account.

## Important project notes

- User records, the current login session, wishlist and orders use browser Local Storage for this classroom demonstration. The cart is held in React state while the app is running.
- Online Payment is only a simulated demonstration option. It does not connect to a real bank or payment gateway.
- This is a frontend-only project. Real deployment would require a backend, secure password handling, server-side authorization and a payment provider.
