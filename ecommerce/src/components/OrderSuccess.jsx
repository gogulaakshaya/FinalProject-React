const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

export default function OrderSuccess({ order, onContinue, onViewOrders }) {
  return (
    <main className="content-section order-success-page">
      <section className="success-card">
        <div className="success-check">✓</div>
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h2>Thank you for your order!</h2>
        <p className="muted">Your order has been placed successfully. You can keep the order ID for reference.</p>
        <div className="success-order-id"><span>Order ID</span><strong>{order.id}</strong></div>
        <div className="success-details">
          <div><span>Customer</span><strong>{order.customer}</strong></div>
          <div><span>Order Total</span><strong>{money(order.total)}</strong></div>
          <div><span>Payment Method</span><strong>{order.paymentMethod}</strong></div>
          <div><span>Payment Status</span><strong>{order.paymentStatus}</strong></div>
          <div><span>Order Status</span><strong>{order.status}</strong></div>
          <div><span>Items</span><strong>{order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</strong></div>
        </div>
        <div className="success-delivery"><strong>Delivering to</strong><p>{order.delivery.name}, {order.delivery.phone}<br />{order.delivery.address}, {order.delivery.city} – {order.delivery.pincode}</p></div>
        <div className="success-actions"><button className="primary-button" onClick={onContinue}>Continue Shopping</button><button className="outline-button" onClick={onViewOrders}>View My Orders</button></div>
      </section>
    </main>
  );
}
