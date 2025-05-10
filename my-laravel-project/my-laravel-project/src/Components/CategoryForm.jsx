import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../axiosClient"; // ✅ Make sure the path is correct
import "./CategoryForm.css"

const CategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryToEdit = location.state || null;

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (categoryToEdit) {
      setCategoryName(categoryToEdit.name);
    }
  }, [categoryToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    const payload = { name: categoryName };

    if (categoryToEdit) {
      // ✅ Update category
      axiosClient
        .put(`/categories/${categoryToEdit.id}`, payload)
        .then(() => {
          alert("Category updated successfully!");
          navigate("/categories");
        })
        .catch((error) => {
          console.error("Update Error:", error);
          alert("Failed to update category");
        });
    } else {
      // ✅ Add new category
      axiosClient
        .post("/categories", payload)
        .then(() => {
          alert("Category added successfully!");
          navigate("/categories");
        })
        .catch((error) => {
          console.error("Add Error:", error);
          alert("Failed to add category");
        });
    }
  };

  return (
    <div className="category-form-container">
  <h2>{categoryToEdit ? "Edit Category" : "Add New Category"}</h2>

  <form onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Category Name"
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      required
    />

    <div className="button-container">
      <button type="submit">
        {categoryToEdit ? "Update Category" : "Add Category"}
      </button>
      <button type="button" onClick={() => navigate("/categories")}>
        Cancel
      </button>
    </div>
  </form>
</div>
  );
};

export default CategoryForm;
