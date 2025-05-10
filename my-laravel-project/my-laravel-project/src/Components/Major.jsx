import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "./Major.css";

const Major = () => {
  const [majors, setMajors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = () => {
    axios
      .get("http://127.0.0.1:8000/api/majors")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMajors(response.data);
        } else if (response.data.data) {
          setMajors(response.data.data);
        } else if (response.data.majors) {
          setMajors(response.data.majors);
        } else {
          setMajors([]);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setMajors([]);
      });
  };

  const handleDeleteMajor = (id) => {
    if (!window.confirm("Are you sure you want to delete this major?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/majors/${id}`)
      .then(() => {
        alert("Major deleted successfully!");
        fetchMajors();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        alert("Failed to delete major.");
      });
  };

  const filteredMajors = majors.filter((major) =>
    major.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="major-container">
      <div className="major-header">
        <h2>Majors</h2>
        <button className="add-btn" onClick={() => navigate("/majors/create")}>
          + Add Major
        </button>
      </div>

      <div className="search-bar">
        <label><FaSearch /></label>
        <input
          type="text"
          placeholder="Search majors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMajors.length === 0 ? (
        <p>No majors found.</p>
      ) : (
        <table className="major-table">
          <thead>
            <tr>
              <th>Major Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMajors.map((major) => (
              <tr key={major.id}>
                <td>{major.name}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/majors/edit/${major.id}`)}
                  >
                    <FaEdit />Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMajor(major.id)}
                  >
                    <FaTrash />  Delete
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

export default Major;
