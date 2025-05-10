// ProductLabel.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const ProductLabel = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="product-label">
      <h1>📦 Product Details</h1>
      <div className="label-box">
        <p><strong>Asset #:</strong> {product.asset_number}</p>
        <p><strong>Vendor:</strong> {product.vendor_name}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Cost:</strong> ₹{product.asset_cost}</p>
        <p><strong>Category:</strong> {product.category_id}</p>
        <p><strong>Date Added:</strong> {product.date_added}</p>
      </div>
    </div>
  );
};

export default ProductLabel;
