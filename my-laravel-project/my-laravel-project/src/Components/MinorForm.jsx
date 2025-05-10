import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./MinorForm.css"

const MinorForm = () => {
  const [minorName, setMinorName] = useState("");
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // If editing

  useEffect(() => {
    fetchMajors();

    if (id) {
      axios
        .get(`http://127.0.0.1:8000/api/minors/${id}`)
        .then((response) => {
          setMinorName(response.data.name);
          setSelectedMajor(response.data.major_id);
        })
        .catch((error) => {
          console.error("Error fetching minor:", error);
          alert("Failed to fetch minor.");
        });
    }
  }, [id]);

  const fetchMajors = () => {
    axios
      .get("http://127.0.0.1:8000/api/majors")
      .then((response) => {
        const majorsData = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setMajors(majorsData);
      })
      .catch((error) => {
        console.error("Error fetching majors:", error);
        alert("Failed to load majors.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!minorName.trim()) {
      alert("Minor name cannot be empty!");
      return;
    }

    if (!selectedMajor) {
      alert("Please select a major!");
      return;
    }

    const payload = { name: minorName, major_id: selectedMajor };

    if (id) {
      // Update minor
      axios
        .put(`http://127.0.0.1:8000/api/minors/${id}`, payload)
        .then(() => {
          alert("Minor updated successfully!");
          navigate("/minors");
        })
        .catch((error) => {
          console.error("Error updating minor:", error);
          alert("Failed to update minor.");
        });
    } else {
      // Create minor
      axios
        .post("http://127.0.0.1:8000/api/minors", payload)
        .then(() => {
          alert("Minor added successfully!");
          navigate("/minors");
        })
        .catch((error) => {
          console.error("Error adding minor:", error);
          alert("Failed to add minor.");
        });
    }
  };

  return (
    <div className="minor-form-container">
      <h2>{id ? "Edit Minor" : "Add Minor"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter minor name"
          value={minorName}
          onChange={(e) => setMinorName(e.target.value)}
          required
        />

        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          required
        >
          <option value="">Select Major</option>
          {majors.map((major) => (
            <option key={major.id} value={major.id}>
              {major.name}
            </option>
          ))}
        </select>

        <div className="button-container">
          <button type="submit">{id ? "Update Minor" : "Add Minor"}</button>
          <button type="button" onClick={() => navigate("/minors")}>
            Cancel
          </button>
        </div>
      </form>

    </div>
  );
};

export default MinorForm;
