export default function Cart({ cart, onRemove, onCheckout, onShop }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <section className="content-section narrow-section">
      <div className="section-heading"><div><p className="eyebrow">YOUR BAG</p><h2>Shopping Cart</h2></div><button className="outline-button" onClick={onShop}>Continue Shopping</button></div>
      {!cart.length ? <div className="empty-state">Your cart is empty.</div> : <>
        <div className="cart-list">
          {cart.map(item => <div className="cart-row" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="cart-product"><strong>{item.name}</strong><span>₹{item.price.toLocaleString("en-IN")} × {item.quantity}</span></div>
            <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
            <button className="remove-button" onClick={() => onRemove(item.id)}>Remove</button>
          </div>)}
        </div>
        <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
        <button className="primary-button" onClick={onCheckout}>Place Order</button>
      </>}
    </section>
  );
}
