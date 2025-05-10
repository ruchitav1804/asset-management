import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient"; // ✅ Ensure the path is correct
import "./MajorForm.css"; // Import the CSS for styling

const MajorForm = () => {
  const [majorName, setMajorName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from route for edit

  // If editing, fetch major details
  useEffect(() => {
    if (id) {
      axiosClient
        .get(`/majors/${id}`)
        .then((response) => setMajorName(response.data.name))
        .catch((error) => {
          console.error("Fetch major error:", error);
          alert("Failed to fetch major details.");
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!majorName.trim()) {
      alert("Major name cannot be empty!");
      return;
    }

    if (id) {
      // Update existing major
      axiosClient
        .put(`/majors/${id}`, { name: majorName })
        .then(() => {
          alert("Major updated successfully!");
          navigate("/majors");
        })
        .catch((error) => {
          console.error("Update error:", error);
          alert("Failed to update major.");
        });
    } else {
      // Create new major
      axiosClient
        .post("/majors", { name: majorName })
        .then(() => {
          alert("Major created successfully!");
          navigate("/majors");
        })
        .catch((error) => {
          console.error("Create error:", error);
          alert("Failed to create major.");
        });
    }
  };

  return (
    <div className="major-form-container">
      <h2>{id ? "Edit Major" : "Add New Major"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter major name"
          value={majorName}
          onChange={(e) => setMajorName(e.target.value)}
          required
        />

        <div className="button-container">
          <button type="submit">{id ? "Update Major" : "Add Major"}</button>
          <button type="button" onClick={() => navigate("/majors")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MajorForm;
