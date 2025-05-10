import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import './Vendor.css';  // Import the CSS file

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = () => {
    axios
      .get("http://127.0.0.1:8000/api/vendors")
      .then((response) => setVendors(response.data))
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/vendors/${id}`)
      .then(() => {
        alert("Vendor deleted successfully!");
        fetchVendors();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        alert("Failed to delete vendor.");
      });
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vendors-container">
      <div className="vendors-header">
        <h2>Vendors List</h2>
        <Link to="/vendors/new">
          <button>+ Add Vendor</button>
        </Link>
      </div>

      <div className="search-container">
        <label><FaSearch /></label>
        <input
          type="text"
          placeholder="Search by Vendor or Business Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="vendors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor Code</th>
            <th>Vendor Name</th>
            <th>Contact Number</th>
            <th>Vendor Email</th>
            <th>Vendor Address</th>
            <th>Business Name</th>
            <th>Business Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td>{vendor.vendor_code}</td>
                <td>{vendor.vendor_name}</td>
                <td>{vendor.contact_number}</td>
                <td>{vendor.vendor_email}</td>
                <td>{vendor.vendor_address}</td>
                <td>{vendor.business_name}</td>
                <td>{vendor.business_number}</td>
                <td className="vendors-actions">
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-vendors">
                No vendors found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vendors;
