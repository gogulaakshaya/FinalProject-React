const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const dateLabel = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

export default function UserOrders({ orders = [], onContinueShopping }) {
  return (
    <main className="content-section user-orders-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR PURCHASES</p>
          <h2>My Orders</h2>
          <p className="muted">View the items you ordered and check their current status.</p>
        </div>
        <button className="primary-button" onClick={onContinueShopping}>Continue Shopping</button>
      </div>

      {!orders.length ? (
        <div className="empty-state orders-empty">
          <div className="orders-empty-icon">▤</div>
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>
          <button className="primary-button" onClick={onContinueShopping}>Explore Products</button>
        </div>
      ) : (
        <div className="user-order-list">
          {orders.map(order => (
            <article className="user-order-card" key={order.id}>
              <div className="user-order-heading">
                <div><span>ORDER ID</span><strong>{order.id}</strong></div>
                <div><span>ORDER DATE</span><strong>{dateLabel(order.date)}</strong></div>
                <div><span>ORDER STATUS</span><strong className={`order-status status-${String(order.status || "Pending").toLowerCase().replace(/[^a-z]+/g, "-")}`}>{order.status || "Pending"}</strong></div>
              </div>
              <div className={`order-tracker tracker-${String(order.status || "Pending").toLowerCase()}`} aria-label={`Order status ${order.status || "Pending"}`}>
                {(["Pending", "Processing", "Completed"]).map((step, index) => <div className={`tracker-step ${["Pending", "Processing", "Completed"].indexOf(order.status || "Pending") >= index ? "reached" : ""}`} key={step}><span>{index + 1}</span><small>{step}</small></div>)}
              </div>
              {order.status === "Cancelled" && <p className="cancelled-order-note">This order has been cancelled.</p>}
              <div className="user-order-items">
                {(order.items || []).map((item, index) => (
                  <div className="user-order-item" key={`${order.id}-${item.id ?? index}`}>
                    {item.image && <img src={item.image} alt={item.name || "Ordered product"} />}
                    <div className="user-order-item-info"><strong>{item.name || "Product"}</strong><span>Quantity: {Number(item.quantity || 1)}</span></div>
                    <strong>{money(Number(item.price || 0) * Number(item.quantity || 1))}</strong>
                  </div>
                ))}
              </div>
              <div className="user-order-footer">
                <div><span>Payment</span><strong>{order.paymentMethod || "Not specified"}</strong><small>{order.paymentStatus || "Payment status unavailable"}</small></div>
                <div className="user-order-total"><span>Order Total</span><strong>{money(order.total)}</strong></div>
              </div>
              {order.delivery && <p className="user-order-address"><strong>Delivery address:</strong> {order.delivery.name}, {order.delivery.phone}, {order.delivery.address}, {order.delivery.city} – {order.delivery.pincode}</p>}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
