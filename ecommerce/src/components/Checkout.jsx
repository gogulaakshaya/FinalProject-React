import { useMemo, useState } from "react";

const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

export default function Checkout({ cart, user, onBack, onPlaceOrder }) {
  const [details, setDetails] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery"
  });
  const [error, setError] = useState("");
  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0), [cart]);

  function update(field, value) {
    setDetails(old => ({ ...old, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!cart.length) {
      setError("Your cart is empty. Add products before checkout.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(details.phone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(details.pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }
    setError("");
    onPlaceOrder(details);
  }

  if (!cart.length) {
    return <section className="content-section narrow-section"><div className="empty-state">Your cart is empty. <button className="inline-link" onClick={onBack}>Return to cart</button></div></section>;
  }

  return (
    <main className="content-section checkout-page">
      <div className="section-heading">
        <div><p className="eyebrow">SECURE CHECKOUT</p><h2>Delivery & Payment</h2><p className="muted">Enter your delivery details and choose how you want to pay.</p></div>
        <button type="button" className="outline-button" onClick={onBack}>← Back to Cart</button>
      </div>
      <form className="checkout-layout" onSubmit={submit}>
        <section className="checkout-panel">
          <h3>Delivery Information</h3>
          <div className="checkout-fields">
            <label>Full name<input required maxLength="70" value={details.name} onChange={e => update("name", e.target.value)} placeholder="Enter recipient name" /></label>
            <label>Mobile number<input required type="tel" inputMode="numeric" maxLength="10" value={details.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" /></label>
            <label className="field-wide">Full address<textarea required rows="3" maxLength="250" value={details.address} onChange={e => update("address", e.target.value)} placeholder="House / Flat no., street, area" /></label>
            <label>City<input required maxLength="60" value={details.city} onChange={e => update("city", e.target.value)} placeholder="City" /></label>
            <label>PIN code<input required inputMode="numeric" maxLength="6" value={details.pincode} onChange={e => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit PIN code" /></label>
          </div>
          <div className="checkout-divider" />
          <h3>Payment Method</h3>
          <label className={`payment-choice ${details.paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
            <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={details.paymentMethod === "Cash on Delivery"} onChange={e => update("paymentMethod", e.target.value)} />
            <span><strong>Cash on Delivery (COD)</strong><small>Pay when your order is delivered.</small></span>
            <b>COD</b>
          </label>
          <label className={`payment-choice ${details.paymentMethod === "Online Payment (Demo)" ? "selected" : ""}`}>
            <input type="radio" name="paymentMethod" value="Online Payment (Demo)" checked={details.paymentMethod === "Online Payment (Demo)"} onChange={e => update("paymentMethod", e.target.value)} />
            <span><strong>Online Payment</strong><small>Demo simulation only — no real payment is collected.</small></span>
            <b>DEMO</b>
          </label>
          {details.paymentMethod === "Online Payment (Demo)" && <p className="demo-payment-note">This option simulates a successful payment for project demonstration. It does not connect to a bank or payment gateway.</p>}
          {error && <p className="checkout-error" role="alert">{error}</p>}
          <button className="primary-button full-button checkout-submit" type="submit">{details.paymentMethod === "Cash on Delivery" ? "Place Order · Cash on Delivery" : "Confirm Demo Payment & Order"}</button>
          <p className="checkout-safe-note">🔒 Your order details are saved with your order for store processing.</p>
        </section>
        <aside className="checkout-panel order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map(item => <div className="summary-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div><strong>{item.name}</strong><small>Qty: {item.quantity}</small></div>
              <b>{money(item.price * item.quantity)}</b>
            </div>)}
          </div>
          <div className="summary-total"><span>Total amount</span><strong>{money(total)}</strong></div>
          <p className="summary-caption">Delivery charges: Free</p>
        </aside>
      </form>
    </main>
  );
}
