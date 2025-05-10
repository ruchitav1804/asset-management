import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.log(error));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>Product Details</h1>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Vendor:</strong> {product.vendor}</p>
      <p><strong>Category:</strong> {product.category.name}</p>
      <p><strong>Price:</strong> {product.price}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <Link to="/products"><button>Back</button></Link>
    </div>
  );
};

export default ProductView;
