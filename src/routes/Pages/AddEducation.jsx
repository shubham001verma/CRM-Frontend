import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../components/Config";

const AddEducation = () => {
  const navigate = useNavigate();
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const token = localStorage.getItem("admin_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!degree) {
      Swal.fire("Error!", "Degree is required", "error");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/education`,
        { degree, field },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success!", "Education added successfully!", "success");
      navigate(-1);
    } catch (error) {
      console.error("Error adding education:", error);
      Swal.fire("Error!", "Failed to add education", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Add Education
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Degree */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Degree</label>
          <input
            type="text"
            placeholder="Enter degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Field */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Field (Optional)</label>
          <input
            type="text"
            placeholder="Enter field of study"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-40 bg-primary text-white font-medium py-2 rounded-md transition duration-300"
        >
          Add Education
        </button>
      </form>
    </div>
  );
};

export default AddEducation;
