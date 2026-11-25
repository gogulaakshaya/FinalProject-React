
import React from "react";
import "./MyOrders.css";

export default function MyOrders({ orders = [], user }) {
  const myOrders = orders.filter(
    order => order.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  return (
    <div className="my-orders-page">
      <div className="orders-heading">
        <div>
          <p className="orders-eyebrow">YOUR ACCOUNT</p>
          <h1>My Orders</h1>
          <p>Track and manage your purchases.</p>
        </div>
        <div className="orders-count">
          {myOrders.length} Orders
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">🛍️</div>
          <h2>No orders yet!</h2>
          <p>Your purchases will appear here once you place an order.</p>
        </div>
      ) : (
        <div className="orders-list">
          {myOrders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">ORDER ID</span>
                  <h3>{order.id}</h3>
                  <p>{new Date(order.date).toLocaleString()}</p>
                </div>

                <span className={`order-status ${(order.status || "Pending").toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-products">
                <h4>Products Ordered</h4>

                {order.items?.map((item, index) => (
                  <div className="order-product" key={item.id || index}>
                    <div className="product-placeholder">🛍️</div>

                    <div className="order-product-info">
                      <strong>{item.name}</strong>
                      <span>Quantity: {item.quantity}</span>
                    </div>

                    <strong className="product-price">
                      ₹{(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div>
                  <span>Payment Method</span>
                  <strong>{order.paymentMethod || "Cash on Delivery"}</strong>
                </div>

                <div>
                  <span>Payment Status</span>
                  <strong>
                    {order.paymentStatus ||
                      (order.paymentMethod === "Cash on Delivery"
                        ? "Pay on Delivery"
                        : "Information unavailable")}
                  </strong>
                </div>
              </div>

              {order.delivery && (
                <div className="order-delivery">
                  <h4>Delivery Address</h4>
                  <p>
                    {order.delivery.name}, {order.delivery.phone}
                  </p>
                  <p>
                    {order.delivery.address}, {order.delivery.city} - {order.delivery.pincode}
                  </p>
                </div>
              )}

              <div className="order-card-footer">
                <span>Total Amount</span>
                <strong>₹{Number(order.total).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
