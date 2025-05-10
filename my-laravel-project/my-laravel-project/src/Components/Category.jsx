import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axiosClient
      .get("/categories")
      .then((response) => {
        const data = response.data.data || response.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Fetch Error:", error.response?.data || error.message);
        setCategories([]);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    axiosClient
      .delete(`/categories/${id}`)
      .then(() => {
        alert("Category deleted successfully");
        fetchCategories();
      })
      .catch((error) => {
        console.error("Delete Error:", error.response?.data || error.message);
        alert("Failed to delete category");
      });
  };

  const handleEdit = (category) => {
    navigate(`/edit-category/${category.id}`, { state: category });
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-container">
      <div className="category-header">
        <h2>Category List</h2>
        <Link to="/add-category">
          <button className="add-btn">+ Add Category</button>
        </Link>
      </div>

      <div className="search-bar">
        <label><FaSearch /></label>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCategories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(category)}>
                  <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(category.id)}>
                  <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Category;
