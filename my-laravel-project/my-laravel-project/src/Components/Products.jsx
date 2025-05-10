import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import "./Products.css";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaQrcode,
  FaDownload,
} from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`http://127.0.0.1:8000/api/products/${id}`)
        .then(() => {
          const updatedProducts = products.filter((product) => product.id !== id);
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSearch = () => {
    let filtered = products;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.asset_number &&
            product.asset_number.toLowerCase().includes(query)) ||
          (product.vendor_name &&
            product.vendor_name.toLowerCase().includes(query)) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    if (searchCategory.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.category_id &&
          product.category_id.toString() === searchCategory
      );
    }

    if (startDate || endDate) {
      filtered = filtered.filter((product) => {
        const productDate = new Date(product.date_added);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return productDate >= start && productDate <= end;
        } else if (start) {
          return productDate >= start;
        } else if (end) {
          return productDate <= end;
        }

        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, searchCategory, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery("");
    setSearchCategory("");
    setStartDate("");
    setEndDate("");
    setFilteredProducts(products);
  };

  const handleDownloadPDF = (product) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Product Details", 20, 20);

    const details = [
      `Asset Number: ${product.asset_number}`,
      `Vendor Code: ${product.vendor_id}`,
      `Vendor Name: ${product.vendor_name}`,
      `Major: ${product.major}`,
      `Minor: ${product.minor}`,
      `Category ID: ${product.category_id}`,
      `Asset Cost: ${product.asset_cost}`,
      `Date Placed in Service: ${product.date_added}`,
      `Deprn Method Code: ${product.deprn_method_code}`,
      `Original Cost: ${product.original_cost}`,
      `Current Cost: ${product.current_cost}`,
      `Accumulated Depreciation: ${product.accumulated_deprn}`,
      `Depreciation Amount: ${product.deprn_amount}`,
      `YTD Depreciation: ${product.ytd_deprn}`,
      `Period Name: ${product.period_name}`,
      `Quantity: ${product.quantity}`,
      `Life in Months: ${product.life_in_months}`,
      `Description: ${product.description}`,
      `Cost Account Description: ${product.cost_account_description}`,
      `Accumulated Account Description: ${product.accumulated_account_description}`,
    ];

    details.forEach((line, index) => {
      doc.setFontSize(12);
      doc.text(line, 20, 30 + index * 8);
    });

    doc.save(`Product_${product.asset_number || product.id}.pdf`);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Asset Number",
      "Vendor Code",
      "Vendor Name",
      "Major",
      "Minor",
      "Category ID",
      "Asset Cost",
      "Date Placed in Service",
      "Deprn Method Code",
      "Original Cost",
      "Current Cost",
      "Accumulated Depreciation",
      "Depreciation Amount",
      "YTD Depreciation",
      "Period Name",
      "Quantity",
      "Life in Months",
      "Description",
      "Cost Account Description",
      "Accumulated Account Description",
    ];

    const rows = filteredProducts.map((p) => [
      p.asset_number,
      p.vendor_id,
      p.vendor_name,
      p.major_id,
      p.minor_id,
      p.category_id,
      p.asset_cost,
      p.date_added,
      p.deprn_method_code,
      p.original_cost,
      p.current_cost,
      p.accumulated_deprn,
      p.deprn_amount,
      p.ytd_deprn,
      p.period_name,
      p.quantity,
      p.life_in_months,
      p.description,
      p.cost_account_description,
      p.accumulated_account_description,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((x) => `"${x}"`).join(","))
        .join("\n");

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "products.csv");
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Products</h2>
        <div>
          <button onClick={handleDownloadCSV} className="download-csv-btn">
            <FaDownload /> Download CSV
          </button>
          <Link to="/products/new">
            <button className="add-product-btn">+ Add Product</button>
          </Link>
        </div>
      </div>

      {/* Search Filters */}
      <div className="search-bar">
        <div className="search-input">
          <label>
            <FaSearch /> Search
          </label>
          <input
            type="text"
            placeholder="Search by Asset No, Vendor Name, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-select">
          <label>
            <FaFilter /> Category ID
          </label>
          <input
            type="text"
            placeholder="Search by Category ID"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>

        <div className="date-range">
          <div>
            <label htmlFor="start-date">
              <FaCalendarAlt /> Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-date">
              <FaCalendarAlt /> End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Asset Number</th>
              <th>Vendor Code</th>
              <th>Vendor Name</th>
              <th>Major</th>
              <th>Minor</th>
              <th>Category ID</th>
              <th>Asset Cost</th>
              <th>Date Placed in Service</th>
              <th>Deprn Method Code</th>
              <th>Original Cost</th>
              <th>Current Cost</th>
              <th>Accumulated Depreciation</th>
              <th>Depreciation Amount</th>
              <th>YTD Depreciation</th>
              <th>Period Name</th>
              <th>Quantity</th>
              <th>Life in Months</th>
              <th>Description</th>
              <th>Cost Account Description</th>
              <th>Accumulated Account Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.asset_number}</td>
                  <td>{product.vendor_code  || '-'}</td>
                  <td>{product.vendor_name}</td>
                  <td>{product.major?.name || '-'}</td>
                  <td>{product.minor?.name || '-'}</td>
                  <td>{product.category?.name || '-'}</td>
                  <td>{product.asset_cost}</td>
                  <td>{product.date_added}</td>
                  <td>{product.deprn_method_code}</td>
                  <td>{product.original_cost}</td>
                  <td>{product.current_cost}</td>
                  <td>{product.accumulated_deprn}</td>
                  <td>{product.deprn_amount}</td>
                  <td>{product.ytd_deprn}</td>
                  <td>{product.period_name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.life_in_months}</td>
                  <td>{product.description}</td>
                  <td>{product.cost_account_description}</td>
                  <td>{product.accumulated_account_description}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/products/edit/${product.id}`}>
                        <button className="edit-btn">
                          <FaEdit /> Edit
                        </button>
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        <FaTrash /> Delete
                      </button>

                      <Link to={`/products/qr/${product.id}`}>
                        <button className="qr-btn">
                          <FaQrcode /> QR
                        </button>
                      </Link>

                      <button
                        className="download-pdf-btn"
                        onClick={() => handleDownloadPDF(product)}
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="21">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>
    </div>
  );
};

export default Products;
