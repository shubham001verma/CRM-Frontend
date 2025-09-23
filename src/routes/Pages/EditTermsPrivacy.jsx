import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../components/Config";

const EditTermsPrivacy = () => {
  const { id } = useParams(); // Get the "id" from URL for the specific Terms & Privacy
  const navigate = useNavigate();
  const [title, setTitle] = useState("Terms & Privacy");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("admin_token");

  // Fetch the current Terms & Privacy details for editing
  useEffect(() => {
    const fetchTermsPrivacyData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/terms-privacy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTitle(response.data.data.title);
        setContent(response.data.data.content);
      } catch (error) {
        console.error("Error fetching Terms & Privacy data:", error);
        Swal.fire("Error", "Failed to fetch Terms & Privacy data", "error");
      }
    };
    fetchTermsPrivacyData();
  }, [id]);

  // Handle form submission to update Terms & Privacy
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/terms-privacy/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success!", "Terms & Privacy updated successfully!", "success");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error updating Terms & Privacy:", error);
      Swal.fire("Error!", "Failed to update Terms & Privacy", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Edit Terms & Privacy
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            placeholder="Enter section title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Content</label>
          <textarea
            placeholder="Enter content for Terms & Privacy"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="6"
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
          Update Terms & Privacy
        </button>
      </form>
    </div>
  );
};

export default EditTermsPrivacy;
