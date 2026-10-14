export default function Header({ user, onNavigate, onLogout, cartCount = 0 }) {
  return (
    <header className="main-header">
      <button className="brand-button" onClick={() => onNavigate(user?.role === "admin" ? "admin" : user ? "user-home" : "guest-home")}>
        <span className="brand-mark">KL</span>
        <span><strong>KL E-Commerce Store</strong><small>Style that fits you</small></span>
      </button>
      <nav className="header-actions">
        {user?.role === "user" && <button className="nav-button" onClick={() => onNavigate("cart")}>Cart ({cartCount})</button>}
        {user?.role === "admin" && <button className="nav-button" onClick={() => onNavigate("admin")}>Dashboard</button>}
        {!user && <>
          <button className="nav-button" onClick={() => onNavigate("login")}>User Login</button>
          <button className="nav-button" onClick={() => onNavigate("register")}>Register</button>
          <button className="primary-button" onClick={() => onNavigate("admin-login")}>Admin Login</button>
        </>}
        {user && <><span className="user-label">👤 {user.name}</span><button className="nav-button" onClick={onLogout}>Logout</button></>}
      </nav>
    </header>
  );
}
