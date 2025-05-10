import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import QRCode from "qrcode";
import axios from "axios";

const ProductQR = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (product && canvasRef.current) {
      const qrData = JSON.stringify({
        asset_number: product.asset_number,
        vendor_name: product.vendor_name,
        description: product.description,
        asset_cost: product.asset_cost,
        category_id: product.category_id,
        date_added: product.date_added,
      });

      QRCode.toCanvas(canvasRef.current, qrData, { width: 256 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [product]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.asset_number}_qr.png`;
    a.click();
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="qr-container">
      <h2>Product QR Code</h2>
      <div className="product-details">
        <p><strong>Asset Number:</strong> {product.asset_number}</p>
        <p><strong>Vendor:</strong> {product.vendor_name}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Asset Cost:</strong> {product.asset_cost}</p>
        <p><strong>Category ID:</strong> {product.category_id}</p>
        <p><strong>Date Added:</strong> {product.date_added}</p>
      </div>
      <canvas ref={canvasRef} style={{ margin: "20px 0" }} />
      <br />
      <button onClick={handleDownload}>Download QR Code</button>
      <br /><br />
      <Link to="/products">
        <button className="back-btn">Back to Products</button>
      </Link>
    </div>
  );
};

export default ProductQR;
