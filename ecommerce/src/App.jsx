import { useEffect, useMemo, useState } from "react";
import { products } from "./data/products.js";
import Header from "./components/Header.jsx";
import ProductList from "./components/ProductList.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import UserOrders from "./components/UserOrders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const ADMIN = { name: "Admin", username: "admin", email: "admin@klecommerce.com", password: "admin123", role: "admin" };
const DEMO_USERS = [
  { name: "Akshaya", email: "gogulaakshaya1@gmail.com", password: "admin123", role: "user" },
  { name: "Sindhu", email: "sindhu@gmail.com", password: "sindhu143", role: "user" },
  ADMIN
];

function readStorage(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
}
function money(value) { return `₹${Number(value).toLocaleString("en-IN")}`; }

export default function App() {
  const [users, setUsers] = useState(() => {
    const saved = readStorage("users", []);
    const combined = [...saved];
    DEMO_USERS.forEach(demo => {
      if (!combined.some(u => u.email?.toLowerCase() === demo.email.toLowerCase())) combined.push(demo);
    });
    return combined;
  });
  const [currentUser, setCurrentUser] = useState(() => readStorage("currentUser", null));
  const [page, setPage] = useState(() => {
    const user = readStorage("currentUser", null);
    return user?.role === "admin" ? "admin" : user?.role === "user" ? "user-home" : "guest-home";
  });
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState(() => readStorage("wishlist", []));
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => readStorage("orders", []));
  const [lastOrder, setLastOrder] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [register, setRegister] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [reset, setReset] = useState({ email: "", password: "", confirm: "" });

  useEffect(() => { localStorage.setItem("users", JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("currentUser");
  }, [currentUser]);
  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter(p =>
      (category === "All" || p.category === category) &&
      `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
    );
    if (sortOrder === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sortOrder === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [category, search, sortOrder]);
  const categories = ["All", ...new Set(products.map(p => p.category))];

  function navigate(nextPage) {
    setMessage({ type: "", text: "" });
    if (nextPage === "admin" && currentUser?.role !== "admin") { setPage("admin-login"); return; }
    if (nextPage === "user-home" && currentUser?.role !== "user") { setPage("guest-home"); return; }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function logout() {
    setCurrentUser(null); setCart([]); setWishlist([]); setSelectedProduct(null); setPage("guest-home");
    setMessage({ type: "success", text: "You have been logged out." });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function addToCart(product) {
    if (currentUser?.role !== "user") { navigate("login"); return; }
    setCart(old => {
      const found = old.find(item => item.id === product.id);
      return found ? old.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...old, { ...product, quantity: 1 }];
    });
    setMessage({ type: "success", text: `${product.name} added to your cart.` });
  }
  function removeFromCart(id) { setCart(old => old.filter(item => item.id !== id)); }
  function updateCartQuantity(id, quantity) {
    const nextQuantity = Number(quantity);
    if (nextQuantity < 1) { removeFromCart(id); return; }
    setCart(old => old.map(item => item.id === id ? { ...item, quantity: nextQuantity } : item));
  }
  function toggleWishlist(product) {
    if (!isUser) { navigate("login"); return; }
    setWishlist(old => old.some(item => item.id === product.id)
      ? old.filter(item => item.id !== product.id)
      : [...old, product]);
  }
  function updateOrderStatus(orderId, status) {
    setOrders(old => old.map(order => order.id === orderId ? { ...order, status } : order));
  }
  function placeOrder(deliveryDetails) {
    if (!cart.length || !isUser) return;
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const order = {
      id: `KLE${Date.now().toString().slice(-8)}`,
      customer: currentUser.name,
      email: currentUser.email,
      items: cart.map(item => ({ ...item })),
      total,
      date: new Date().toISOString(),
      status: "Pending",
      paymentMethod: deliveryDetails.paymentMethod,
      paymentStatus: deliveryDetails.paymentMethod === "Cash on Delivery" ? "Pay on Delivery" : "Demo Payment Successful (Simulation)",
      delivery: {
        name: deliveryDetails.name,
        phone: deliveryDetails.phone,
        address: deliveryDetails.address,
        city: deliveryDetails.city,
        pincode: deliveryDetails.pincode
      }
    };
    setOrders(old => [order, ...old]);
    setLastOrder(order);
    setCart([]);
    setMessage({ type: "", text: "" });
    setPage("order-success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function submitLogin(event) {
    event.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const account = users.find(u => u.email.toLowerCase() === email);
    if (!account) { setMessage({ type: "error", text: "Email is not registered." }); return; }
    if (account.role === "admin") { setMessage({ type: "error", text: "This is an admin account. Use Admin Login." }); return; }
    if (account.password !== loginPassword) { setMessage({ type: "error", text: "Incorrect password." }); return; }
    setCurrentUser({ name: account.name, email: account.email, role: "user" });
    setLoginPassword(""); setPage("user-home");
    setMessage({ type: "success", text: `Welcome back, ${account.name}!` });
  }
  function submitAdminLogin(event) {
    event.preventDefault();
    const account = users.find(u =>
      u.role === "admin" &&
      (u.username || u.email.split("@")[0]).toLowerCase() === adminUsername.trim().toLowerCase()
    );
    if (!account || account.role !== "admin") { setMessage({ type: "error", text: "Admin account not found." }); return; }
    if (account.password !== adminPassword) { setMessage({ type: "error", text: "Incorrect admin password." }); return; }
    setCurrentUser({ name: account.name, email: account.email, role: "admin" });
    setAdminPassword(""); setPage("admin");
    setMessage({ type: "success", text: "Admin login successful." });
  }
  function submitRegister(event) {
    event.preventDefault();
    const email = register.email.trim().toLowerCase();
    if (!register.name.trim()) { setMessage({ type: "error", text: "Please enter your full name." }); return; }
    if (register.phone.trim() && !/^[6-9]\d{9}$/.test(register.phone.trim())) { setMessage({ type: "error", text: "Enter a valid 10-digit mobile number or leave it blank." }); return; }
    if (register.password !== register.confirm) { setMessage({ type: "error", text: "Passwords do not match." }); return; }
    if (register.password.length < 6) { setMessage({ type: "error", text: "Password must contain at least 6 characters." }); return; }
    if (users.some(u => u.email.toLowerCase() === email)) { setMessage({ type: "error", text: "This email is already registered." }); return; }
    const newUser = { name: register.name.trim(), email, phone: register.phone.trim(), password: register.password, role: "user" };
    setUsers(old => [...old, newUser]);
    setRegister({ name: "", email: "", phone: "", password: "", confirm: "" });
    setLoginEmail(email); setPage("login");
    setMessage({ type: "success", text: "Registration successful. Please log in." });
  }
  function submitReset(event) {
    event.preventDefault();
    const email = reset.email.trim().toLowerCase();
    const account = users.find(u => u.email.toLowerCase() === email);
    if (!account || account.role === "admin") { setMessage({ type: "error", text: "A registered user account with this email was not found." }); return; }
    if (reset.password !== reset.confirm) { setMessage({ type: "error", text: "Passwords do not match." }); return; }
    if (reset.password.length < 6) { setMessage({ type: "error", text: "Password must contain at least 6 characters." }); return; }
    setUsers(old => old.map(u => u.email.toLowerCase() === email ? { ...u, password: reset.password } : u));
    setReset({ email: "", password: "", confirm: "" });
    setPage("login"); setMessage({ type: "success", text: "Password updated. You can now log in." });
  }

  const isUser = currentUser?.role === "user";
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="app-shell">
      <Header user={currentUser} onNavigate={navigate} onLogout={logout} cartCount={cartCount} wishlistCount={wishlist.length} />
      {message.text && <div className={`notice ${message.type}`} role="status">
        <span>{message.type === "error" ? "❌" : "✓"} {message.text}</span>
        <button aria-label="Dismiss message" onClick={() => setMessage({ type: "", text: "" })}>×</button>
      </div>}

      {(page === "guest-home" || page === "user-home") && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">{isUser ? "WELCOME BACK" : "NEW SEASON • NEW STYLE"}</p>
              <h1>{isUser ? `Hello, ${currentUser.name}!` : <>Find your <span>everyday style.</span></>}</h1>
              <p>{isUser ? "Discover something you’ll love today." : "Explore clothing, accessories and skincare picked for your everyday life."}</p>
              <button className="primary-button hero-button" onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })}>Explore Collection <span>→</span></button>
            </div>
            <div className="hero-art"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-sticker">FIND YOUR<br/>OWN STYLE ✦</div><div className="hero-circle">KL<span>COLLECTION</span></div></div>
          </section>
          <section className="catalogue-section" id="catalogue">
            <div className="catalogue-top">
              <div><p className="eyebrow">CURATED FOR YOU</p><h2>{isUser ? "Shop our collection" : "Popular Products"}</h2><p className="muted">Find your next favourite.</p></div>
              <div className="catalogue-tools">
                <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" />
                <select className="sort-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)} aria-label="Sort products">
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
            {!isUser && <div className="guest-notice">🔐 Login to add products to your cart and place orders.</div>}
            <div className="category-row">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`category-button ${category === c ? "active" : ""}`}>{c}</button>)}</div>
            <ProductList
              products={visibleProducts}
              loggedIn={isUser}
              onAdd={addToCart}
              onLogin={() => navigate("login")}
              onDetails={product => { setSelectedProduct(product); navigate("product-details"); }}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          </section>
        </>
      )}

      {page === "login" && <AuthLayout eyebrow="WELCOME BACK" title="Login to your account" subtitle="Sign in to continue shopping.">
        <form className="form-stack" onSubmit={submitLogin}>
          <label>Email address<input type="email" required autoComplete="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" /></label>
          <PasswordField label="Password" required autoComplete="current-password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Enter your password" />
          <button className="primary-button full-button" type="submit">Login</button>
          <button className="text-button" type="button" onClick={() => { setMessage({type:"",text:""}); setPage("forgot-password"); }}>Forgot password?</button>
          <p className="form-foot">New here? <button className="inline-link" type="button" onClick={() => navigate("register")}>Create an account</button></p>
          <p className="demo-note">Demo user: gogulaakshaya1@gmail.com / admin123</p>
        </form>
      </AuthLayout>}

      {page === "register" && <AuthLayout eyebrow="JOIN THE KL COMMUNITY" title="Create an account" subtitle="Register to start adding products to your cart.">
        <form className="form-stack" onSubmit={submitRegister}>
          <label>Full name<input required value={register.name} onChange={e => setRegister({...register, name:e.target.value})} placeholder="Your name" /></label>
          <label>Email address<input type="email" required value={register.email} onChange={e => setRegister({...register, email:e.target.value})} placeholder="you@example.com" /></label>
          <label>Phone number<input type="tel" value={register.phone} onChange={e => setRegister({...register, phone:e.target.value})} placeholder="Optional" /></label>
          <PasswordField label="Password" required minLength="6" value={register.password} onChange={e => setRegister({...register, password:e.target.value})} placeholder="At least 6 characters" />
          <PasswordField label="Confirm password" required value={register.confirm} onChange={e => setRegister({...register, confirm:e.target.value})} placeholder="Re-enter password" />
          <button className="primary-button full-button" type="submit">Create Account</button>
          <p className="form-foot">Already registered? <button className="inline-link" type="button" onClick={() => navigate("login")}>Login</button></p>
        </form>
      </AuthLayout>}

      {page === "admin-login" && <AuthLayout eyebrow="RESTRICTED AREA" title="Admin login" subtitle="Sign in to manage users and customer orders.">
        <form className="form-stack" onSubmit={submitAdminLogin}>
          <label>Admin username<input type="text" required value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="admin" /></label>
          <PasswordField label="Password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Enter admin password" />
          <button className="primary-button full-button" type="submit">Login as Admin</button>
          <p className="demo-note">Demo admin: admin / admin123</p>
          <p className="form-foot"><button className="inline-link" type="button" onClick={() => navigate("login")}>User login</button> · <button className="inline-link" type="button" onClick={() => navigate("guest-home")}>Back to store</button></p>
        </form>
      </AuthLayout>}

      {page === "forgot-password" && <AuthLayout eyebrow="ACCOUNT RECOVERY" title="Reset your password" subtitle="Enter your registered user email and choose a new password.">
        <form className="form-stack" onSubmit={submitReset}>
          <label>Email address<input type="email" required value={reset.email} onChange={e => setReset({...reset, email:e.target.value})} placeholder="you@example.com" /></label>
          <PasswordField label="New password" required minLength="6" value={reset.password} onChange={e => setReset({...reset, password:e.target.value})} />
          <PasswordField label="Confirm new password" required value={reset.confirm} onChange={e => setReset({...reset, confirm:e.target.value})} />
          <button className="primary-button full-button" type="submit">Update Password</button>
          <p className="form-foot"><button className="inline-link" type="button" onClick={() => navigate("login")}>Back to login</button></p>
        </form>
      </AuthLayout>}

      {page === "user-orders" && isUser && <UserOrders orders={orders.filter(order => order.email?.toLowerCase() === currentUser.email?.toLowerCase())} onContinueShopping={() => navigate("user-home")} />}
      {page === "wishlist" && isUser && <section className="content-section"><div className="section-heading"><div><p className="eyebrow">SAVED FOR LATER</p><h2>My Wishlist</h2></div><button className="outline-button" onClick={() => navigate("user-home")}>Continue Shopping</button></div><ProductList products={wishlist} loggedIn={isUser} onAdd={addToCart} onLogin={() => navigate("login")} onDetails={product => { setSelectedProduct(product); navigate("product-details"); }} wishlist={wishlist} onToggleWishlist={toggleWishlist} /></section>}
      {page === "product-details" && selectedProduct && <main className="content-section product-detail-page"><button className="outline-button" onClick={() => navigate(isUser ? "user-home" : "guest-home")}>← Back to Products</button><article className="product-detail-card"><img src={selectedProduct.image} alt={selectedProduct.name} /><div><p className="eyebrow">{selectedProduct.category}</p><h2>{selectedProduct.name}</h2><p className="rating">⭐ {Number(selectedProduct.rating || 0).toFixed(1)} / 5</p><strong className="product-detail-price">{money(selectedProduct.price)}</strong><p className="muted">A carefully selected item from the KL E-Commerce collection.</p><div className="product-detail-actions"><button className="primary-button" onClick={() => addToCart(selectedProduct)}>Add to Cart</button><button className="outline-button" onClick={() => toggleWishlist(selectedProduct)}>{wishlist.some(item => item.id === selectedProduct.id) ? "♥ Saved" : "♡ Add to Wishlist"}</button></div></div></article></main>}
      {page === "cart" && isUser && <Cart cart={cart} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={() => navigate("checkout")} onShop={() => navigate("user-home")} />}
      {page === "checkout" && isUser && <Checkout cart={cart} user={currentUser} onBack={() => navigate("cart")} onPlaceOrder={placeOrder} />}
      {page === "order-success" && isUser && lastOrder && <OrderSuccess order={lastOrder} onContinue={() => navigate("user-home")} onViewOrders={() => navigate("user-orders")} />}
      {page === "admin" && isAdmin && <AdminDashboard users={users} orders={orders} onUpdateOrderStatus={updateOrderStatus}/>}
      {page === "admin" && !isAdmin && <AuthLayout title="Admin access required" subtitle="Please sign in with an administrator account."><button className="primary-button full-button" onClick={() => navigate("admin-login")}>Go to Admin Login</button></AuthLayout>}

      <footer className="site-footer"><strong>KL E-Commerce Store</strong><span>Made for your everyday style.</span><small>© {new Date().getFullYear()} KL E-Commerce Store</small></footer>
    </div>
  );
}

function PasswordField({ label, ...inputProps }) {
  const [visible, setVisible] = useState(false);
  return <label className="password-field">{label}<span className="password-input-wrap"><input {...inputProps} type={visible ? "text" : "password"} /><button type="button" className="password-toggle" onClick={() => setVisible(value => !value)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? "Hide" : "Show"}</button></span></label>;
}

function AuthLayout({ eyebrow, title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><span className="brand-mark">KL</span><span>KL E-Commerce Store</span></div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}</section><div className="auth-side"><p className="eyebrow">KL COLLECTION</p><h2>Everyday essentials.<br/>A little more you.</h2><p>Discover clothing, accessories and skincare for your own kind of style.</p><div className="side-decoration">KL<span>STYLE • COMFORT • YOU</span></div></div></main>;
}
