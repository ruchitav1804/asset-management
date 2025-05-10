import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "./Minor.css";

const Minor = () => {
  const [minors, setMinors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMinors();
  }, []);

  const fetchMinors = () => {
    axios
      .get("http://127.0.0.1:8000/api/minors")
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setMinors(data || []);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteMinor = (id) => {
    if (!window.confirm("Are you sure you want to delete this minor?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/minors/${id}`)
      .then(() => {
        alert("Minor deleted successfully!");
        fetchMinors();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        alert("Failed to delete minor.");
      });
  };

  const filteredMinors = minors.filter((minor) =>
    minor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="minor-container">
      <div className="minor-header">
        <h2>Minors</h2>
        <button className="add-btn" onClick={() => navigate("/minors/create")}>
          + Add Minor
        </button>
      </div>

      <div className="search-bar">
        <label><FaSearch /></label>
        <input
          type="text"
          placeholder="Search minors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMinors.length > 0 ? (
        <table className="minor-table">
          <thead>
            <tr>
              <th>Minor Name</th>
              <th>Associated Major</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMinors.map((minor) => (
              <tr key={minor.id}>
                <td>{minor.name}</td>
                <td>{minor.major ? minor.major.name : "No Major Assigned"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/minors/edit/${minor.id}`)}
                  >
                    <FaEdit />Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMinor(minor.id)}
                  >
                    <FaTrash />Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No minors found.</p>
      )}
    </div>
  );
};

export default Minor;
