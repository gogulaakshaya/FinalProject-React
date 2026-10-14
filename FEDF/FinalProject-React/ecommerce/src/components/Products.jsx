import { products } from "../data/products.js";
import ProductList from "./ProductList.jsx";

export default function Products({ loggedIn = false, onAdd, onLogin }) {
  return <section className="content-section">
    <h2>Products</h2>
    <ProductList products={products} loggedIn={loggedIn} onAdd={onAdd} onLogin={onLogin} />
  </section>;
}
