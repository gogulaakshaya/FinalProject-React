const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const STATUSES = ["Pending", "Processing", "Completed", "Cancelled"];

export default function AdminDashboard({
  users = [],
  orders = [],
  onUpdateOrderStatus,
}) {
  const customerUsers = users.filter((user) => user.role === "user");

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const pendingOrders = orders.filter(
    (order) => !order.status || order.status === "Pending"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <section className="content-section admin-content admin-dashboard">

      {/* Dashboard heading */}
      <div className="admin-heading">
        <div>
          <p className="eyebrow">STORE MANAGEMENT</p>
          <h2>Admin Dashboard</h2>
          <p className="admin-subtitle">
            Monitor your store, customers and orders from one place.
          </p>
        </div>

        <div className="admin-heading-tag">
          <span className="admin-live-dot"></span>
          Store overview
        </div>
      </div>

      {/* Statistics */}
      <div className="admin-stats-grid">

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Registered Users</span>
            <span className="admin-stat-icon">♙</span>
          </div>
          <strong>{customerUsers.length}</strong>
          <small>Customer accounts</small>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Orders</span>
            <span className="admin-stat-icon">▤</span>
          </div>
          <strong>{orders.length}</strong>
          <small>Orders received</small>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Completed Revenue</span>
            <span className="admin-stat-icon">₹</span>
          </div>
          <strong>{money(totalRevenue)}</strong>
          <small>From completed orders</small>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Order Value</span>
            <span className="admin-stat-icon">↗</span>
          </div>
          <strong>{money(totalOrderValue)}</strong>
          <small>Across all orders</small>
        </article>

      </div>

      {/* Order overview */}
      <div className="admin-panel admin-overview-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Order Overview</h3>
            <p>Current order status at a glance</p>
          </div>
          <span className="admin-total-label">
            {orders.length} total
          </span>
        </div>

        <div className="admin-overview-grid">

          <div className="admin-overview-item">
            <span className="overview-dot pending-dot"></span>
            <div>
              <strong>{pendingOrders}</strong>
              <small>Pending</small>
            </div>
          </div>

          <div className="admin-overview-item">
            <span className="overview-dot processing-dot"></span>
            <div>
              <strong>{processingOrders}</strong>
              <small>Processing</small>
            </div>
          </div>

          <div className="admin-overview-item">
            <span className="overview-dot completed-dot"></span>
            <div>
              <strong>{completedOrders}</strong>
              <small>Completed</small>
            </div>
          </div>

          <div className="admin-overview-item">
            <span className="overview-dot cancelled-dot"></span>
            <div>
              <strong>{cancelledOrders}</strong>
              <small>Cancelled</small>
            </div>
          </div>

        </div>
      </div>

      {/* Registered customers */}
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Registered Customers</h3>
            <p>Customer accounts created in the store</p>
          </div>
          <span className="admin-total-label">
            {customerUsers.length} customers
          </span>
        </div>

        {customerUsers.length === 0 ? (
          <div className="admin-empty-state">
            <span>♙</span>
            <strong>No customers yet</strong>
            <p>Registered customers will appear here.</p>
          </div>
        ) : (
          <div className="table-wrap admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>Account Type</th>
                </tr>
              </thead>

              <tbody>
                {customerUsers.map((user, index) => (
                  <tr key={`${user.email}-${index}`}>
                    <td>
                      <div className="admin-customer-cell">
                        <span className="admin-avatar">
                          {(user.name || "C").charAt(0).toUpperCase()}
                        </span>
                        <strong>{user.name || "Customer"}</strong>
                      </div>
                    </td>

                    <td>{user.email || "—"}</td>
                    <td>{user.phone || "—"}</td>

                    <td>
                      <span className="table-pill">Customer</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer orders */}
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Customer Orders</h3>
            <p>Review purchases and update order progress</p>
          </div>
          <span className="admin-total-label">
            {orders.length} orders
          </span>
        </div>

        {!orders.length ? (
          <div className="admin-empty-state">
            <span>▤</span>
            <strong>No orders yet</strong>
            <p>New customer orders will appear here.</p>
          </div>
        ) : (
          <div className="table-wrap admin-table-wrap admin-orders-wrap">
            <table className="admin-table admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Delivery Details</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const status = order.status || "Pending";

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className="admin-order-id">
                          {order.id}
                        </strong>
                      </td>

                      <td>
                        {order.date
                          ? new Date(order.date).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td>
                        <div className="admin-order-customer">
                          <strong>{order.customer || "—"}</strong>
                          <small>{order.email || ""}</small>
                        </div>
                      </td>

                      <td className="admin-items-cell">
                        {(order.items || [])
                          .map(
                            (item) =>
                              `${item.name} × ${item.quantity}`
                          )
                          .join(", ") || "—"}
                      </td>

                      <td>
                        <strong>{money(order.total)}</strong>
                      </td>

                      <td>
                        {order.paymentMethod || "—"}
                        <small className="admin-cell-note">
                          {order.paymentStatus || ""}
                        </small>
                      </td>

                      <td className="admin-delivery-cell">
                        {order.delivery
                          ? `${order.delivery.name || ""}, ${
                              order.delivery.phone || ""
                            }, ${order.delivery.address || ""}, ${
                              order.delivery.city || ""
                            } - ${order.delivery.pincode || ""}`
                          : "—"}
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <select
                          className="admin-status-select"
                          aria-label={`Update status for ${order.id}`}
                          value={status}
                          onChange={(event) =>
                            onUpdateOrderStatus?.(
                              order.id,
                              event.target.value
                            )
                          }
                        >
                          {STATUSES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </section>
  );
}