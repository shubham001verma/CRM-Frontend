import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../components/Config";

// ✅ Backend ke AVAILABLE_FEATURES ke same list
const AVAILABLE_FEATURES = [
 "Unlimited Chat",
  "Advance Filter",
  "Profile View",
  "Contact View",
  "Photo View",
  "Video Call",
  "Calling",
  "See Who Viewed Your Profile"
];

const EditPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("admin_token");

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [durationInDays, setDurationInDays] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Auto calculate discount
  useEffect(() => {
    if (price > 0 && offerPrice > 0 && offerPrice < price) {
      const discount = Math.round(((price - offerPrice) / price) * 100);
      setDiscountPercent(discount);
    } else {
      setDiscountPercent(0);
    }
  }, [price, offerPrice]);

  // Fetch existing plan
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const planData = response.data;

        setName(planData.name);
        setPrice(planData.price);
        setOfferPrice(planData.offerPrice || 0);
        setDurationInDays(planData.durationInDays);
        setIsActive(planData.isActive);
        setFeatures(planData.features || []);
      } catch (error) {
        console.error("Error fetching plan data:", error);
        Swal.fire("Error", "Failed to fetch plan data.", "error");
        navigate("/plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [id, navigate, token]);

  // ✅ Toggle feature selection
  const handleFeatureToggle = (feature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        name,
        price,
        offerPrice,
        durationInDays,
        isActive,
        features,
      };

      await axios.put(`${API_BASE_URL}/api/plans/${id}`, planData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Success!", "Plan updated successfully!", "success");
      navigate(-1);
    } catch (error) {
      console.error("Error updating plan:", error);
      Swal.fire("Error!", "Failed to update plan", "error");
    }
  };

  if (loading) {
    return <div>Loading plan data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Edit Plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Plan Name</label>
            <input
              type="text"
              placeholder="e.g., Silver Plan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Price (₹)</label>
            <input
              type="number"
              placeholder="e.g., 999"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Offer Price + Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Offer Price (₹)</label>
            <input
              type="number"
              placeholder="e.g., 799"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Discount %</label>
            <input
              type="text"
              value={`${discountPercent}%`}
              readOnly
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white cursor-not-allowed"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Duration (in Days)</label>
          <input
            type="number"
            placeholder="e.g., 30, 90, 180"
            value={durationInDays}
            onChange={(e) => setDurationInDays(Number(e.target.value))}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Features Section */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_FEATURES.map((feature) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded 
                    focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 
                    focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="isActive" className="ml-2 text-gray-700 dark:text-gray-300">
            Is Active?
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-40 bg-primary text-white font-medium py-2 rounded-md transition duration-300 hover:bg-opacity-80"
        >
          Update Plan
        </button>
      </form>
    </div>
  );
};

export default EditPlan;
