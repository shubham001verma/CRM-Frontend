import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../components/Config";

const EditContact = () => {
  const { id } = useParams(); // Get the "id" from URL for the specific contact
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const token = localStorage.getItem("admin_token");

  // Fetch the current contact details for editing
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmail(response.data.data.email);
        setPhone(response.data.data.phone);
        setAddress(response.data.data.address);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        Swal.fire("Error", "Failed to fetch contact data", "error");
      }
    };
    fetchContactData();
  }, [id]);

  // Handle form submission to update contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/contact/${id}`,
        { email, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success!", "Contact updated successfully!", "success");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error updating contact:", error);
      Swal.fire("Error!", "Failed to update contact", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Edit Contact Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Address</label>
          <textarea
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows="4"
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
          Update Contact
        </button>
      </form>
    </div>
  );
};

export default EditContact;
