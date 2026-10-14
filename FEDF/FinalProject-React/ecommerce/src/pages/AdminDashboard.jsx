export default function AdminDashboard({ users, orders }) {
  return (
    <section className="content-section admin-content">
      <p className="eyebrow">STORE MANAGEMENT</p><h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card"><span>Registered Users</span><strong>{users.filter(u => u.role === "user").length}</strong></div>
        <div className="stat-card"><span>Total Orders</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Order Revenue</span><strong>₹{orders.reduce((s, o) => s + Number(o.total || 0), 0).toLocaleString("en-IN")}</strong></div>
      </div>
      <div className="admin-panel"><h3>Registered Users</h3>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
          <tbody>{users.map((u, i) => <tr key={`${u.email}-${i}`}><td>{u.name}</td><td>{u.email}</td><td>{u.phone || "—"}</td><td><span className="table-pill">{u.role}</span></td></tr>)}</tbody>
        </table></div>
      </div>
      <div className="admin-panel"><h3>Customer Orders</h3>
        {!orders.length ? <p className="muted">No orders have been placed yet.</p> :
          <div className="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Items</th><th>Total</th></tr></thead>
            <tbody>{orders.map(o => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{o.email}</td><td>{o.items?.map(i => `${i.name} × ${i.quantity}`).join(", ")}</td><td>₹{Number(o.total).toLocaleString("en-IN")}</td></tr>)}</tbody>
          </table></div>}
      </div>
    </section>
  );
}
