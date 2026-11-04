export default function ProductCard({ product, loggedIn, onAdd, onLogin }) {
  return (
    <article className="product-card">
      <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
      <div className="product-info">
        <span className="category-pill">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="rating">⭐ {product.rating.toFixed(1)}</p>
        <p className="price">₹{product.price.toLocaleString("en-IN")}</p>
        {loggedIn
          ? <button className="primary-button full-button" onClick={() => onAdd(product)}>Add to Cart</button>
          : <button className="primary-button full-button" onClick={onLogin}>Login to Buy</button>}
      </div>
    </article>
  );
}
