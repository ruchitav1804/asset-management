import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProductForm.css";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:8000/api";

  const [formData, setFormData] = useState({
    asset_number: "",
    vendor_id: "",
    vendor_code: "",
    vendor_name: "",
    major_id: "",
    minor_id: "",
    category_id: "",
    asset_cost: "",
    date_added: new Date(),
    deprn_method_code: "",
    original_cost: "",
    current_cost: "",
    accumulated_deprn: "",
    deprn_amount: "",
    ytd_deprn: "",
    period_name: "",
    quantity: "",
    life_in_months: "",
    description: "",
    cost_account_description: "",
    accumulated_account_description: "",
  });

  const [categories, setCategories] = useState([]);
  const [majors, setMajors] = useState([]);
  const [minors, setMinors] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories, vendors, majors, minors and product details as before...
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories`);
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/vendors`);
        setVendors(res.data || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/majors`)
      .then(response => setMajors(response.data.data || []))
      .catch(error => console.error("Error fetching majors:", error));
  }, []);

  useEffect(() => {
    if (formData.major_id) {
      axios.get(`${BASE_URL}/majors/${formData.major_id}/minors`)
        .then(response => setMinors(response.data || []))
        .catch(error => console.error("Error fetching minors:", error));
    } else {
      setMinors([]);
    }
  }, [formData.major_id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        const product = res.data;
        setFormData({
          ...product,
          date_added: product.date_added ? new Date(product.date_added) : new Date(),
        });
        if (product.major_id) {
          const minorsRes = await axios.get(`${BASE_URL}/majors/${product.major_id}/minors`);
          setMinors(minorsRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date_added: date }));
  };

  const handleVendorCodeChange = (vendorCode) => {
    const selectedVendor = vendors.find(vendor => vendor.vendor_code === vendorCode);
    setFormData((prev) => ({
      ...prev,
      vendor_code: vendorCode,
      vendor_id: selectedVendor ? selectedVendor.id : "",
      vendor_name: selectedVendor ? selectedVendor.vendor_name : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formData.date_added ? formData.date_added.toISOString().slice(0, 19).replace("T", " ") : null;
    const payload = { ...formData, date_added: formattedDate };

    try {
      if (id) {
        await axios.put(`${BASE_URL}/products/${id}`, payload);
        alert("Product updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/products`, payload);
        alert("Product added successfully!");
      }
      navigate("/products");
    } catch (error) {
      if (error.response) {
        alert(`Failed: ${error.response.data.message}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-form-container">
      <h2>{id ? "Edit Product" : "Add New Product"}</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asset Number</label>
          <input type="text" name="asset_number" value={formData.asset_number} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Vendor Code</label>
          <select name="vendor_code" value={formData.vendor_code} onChange={(e) => handleVendorCodeChange(e.target.value)} required>
            <option value="">Select Vendor Code</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.vendor_code}>{vendor.vendor_code}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Vendor Name</label>
          <input type="text" name="vendor_name" value={formData.vendor_name} readOnly />
        </div>

        <div className="form-group">
          <label>Major</label>
          <select name="major_id" value={formData.major_id} onChange={handleChange} required>
            <option value="">Select Major</option>
            {majors.map(major => (
              <option key={major.id} value={major.id}>{major.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Minor</label>
          <select name="minor_id" value={formData.minor_id} onChange={handleChange} required>
            <option value="">Select Minor</option>
            {minors.map(minor => (
              <option key={minor.id} value={minor.id}>{minor.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Asset Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Remaining Fields */}
        <div className="form-group">
          <label>Asset Cost</label>
          <input
            type="number"
            name="asset_cost"
            value={formData.asset_cost}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date Placed in Service</label>
          <DatePicker
            selected={formData.date_added}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        </div>

        {/* Continue with the rest of the fields */}
        <div className="form-group">
          <label>Deprn Method Code</label>
          <input
            type="text"
            name="deprn_method_code"
            value={formData.deprn_method_code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Original Cost</label>
          <input
            type="number"
            name="original_cost"
            value={formData.original_cost}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Current Cost</label>
          <input
            type="number"
            name="current_cost"
            value={formData.current_cost}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Accumulated Depreciation Amount</label>
          <input
            type="number"
            name="accumulated_deprn"
            value={formData.accumulated_deprn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Depreciation Amount</label>
          <input
            type="number"
            name="deprn_amount"
            value={formData.deprn_amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>YTD Depreciation</label>
          <input
            type="number"
            name="ytd_deprn"
            value={formData.ytd_deprn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Period Name</label>
          <input
            type="text"
            name="period_name"
            value={formData.period_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Life in Months</label>
          <input
            type="number"
            name="life_in_months"
            value={formData.life_in_months}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Cost Account Description</label>
          <textarea
            name="cost_account_description"
            value={formData.cost_account_description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Accumulated Account Description</label>
          <textarea
            name="accumulated_account_description"
            value={formData.accumulated_account_description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit">{id ? "Update Product" : "Add Product"}</button>
          <button type="button" onClick={() => navigate("/products")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;