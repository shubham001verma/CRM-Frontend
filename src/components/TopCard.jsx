import React, { useEffect, useState } from "react";
import axios from "axios";import { Users, UserCircle, Star } from "lucide-react";
import API_BASE_URL from './Config'

const TopCard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [totalPremiumUsers, setTotalPremiumUsers] = useState(0);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalProfiles();
    fetchTotalPremiumUsers();
  }, []);

  const fetchTotalUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/count`);
      setTotalUsers(res.data.totalUsers);
    } catch (error) {
      console.error("Total users fetch error:", error);
    }
  };

  const fetchTotalProfiles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/profile/count`);
      setTotalProfiles(res.data.totalProfiles);
    } catch (error) {
      console.error("Total profiles fetch error:", error);
    }
  };

  const fetchTotalPremiumUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/upremium/count`);
      setTotalPremiumUsers(res.data.premiumUserCount);
    } catch (error) {
      console.error("Total premium users fetch error:", error);
    }
  };

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      label: "Total Profiles",
      value: totalProfiles,
      icon: <UserCircle className="w-6 h-6 text-primary" />
    },
    {
      label: "Premium Users",
      value: totalPremiumUsers,
      icon: <Star className="w-6 h-6 text-primary" />

    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 p-3">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 transition-colors"
        >
          <div className="flex items-center space-x-5">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
              {card.icon}
            </div>
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCard;
