export default function Admin() {
  return <section className="page-box">
    <h1>Welcome to Admin Page</h1>
    <p>You are logged in as Administrator.</p>
    <div className="admin-grid">
      <div className="card">Manage Products</div>
      <div className="card">Manage Users</div>
      <div className="card">View Orders</div>
    </div>
  </section>;
}
