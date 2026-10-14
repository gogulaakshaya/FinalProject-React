import ProductCard from "./ProductCard.jsx";

export default function ProductList({ products, loggedIn, onAdd, onLogin }) {
  if (!products.length) return <div className="empty-state">No products found. Try another search or category.</div>;
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} loggedIn={loggedIn} onAdd={onAdd} onLogin={onLogin} />
      ))}
    </div>
  );
}
