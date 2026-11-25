export default function ProductCard({ product, loggedIn, onAdd, onLogin, onDetails, wishlist = [], onToggleWishlist }) {
  const saved = wishlist.some(item => item.id === product.id);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        <button className={`wishlist-button ${saved ? "saved" : ""}`} onClick={() => loggedIn ? onToggleWishlist?.(product) : onLogin?.()} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}>{saved ? "♥" : "♡"}</button>
      </div>
      <div className="product-info">
        <span className="category-pill">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="rating">⭐ {Number(product.rating || 0).toFixed(1)}</p>
        <p className="price">₹{Number(product.price).toLocaleString("en-IN")}</p>
        <div className="product-card-actions"><button className="outline-button" onClick={() => onDetails?.(product)}>View Details</button>{loggedIn ? <button className="primary-button" onClick={() => onAdd(product)}>Add to Cart</button> : <button className="primary-button" onClick={onLogin}>Login to Buy</button>}</div>
      </div>
    </article>
  );
}
