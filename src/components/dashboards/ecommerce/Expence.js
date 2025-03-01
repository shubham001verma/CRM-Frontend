import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import API_BASE_URL from "../../Config";

const Expence = () => {
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const userId = sessionStorage.getItem("useridsrmapp");
  const theme = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/project/getprojectbyclientid/${userId}`
        );
        const projectData = response.data.project || [];
        const total = projectData.reduce((sum, project) => sum += + (+project.price || 0), 0);
        setTotalPrice(total);
        const topProjects = projectData
          .sort((a, b) => (b.price || 0) - (a.price || 0))
          .slice(0, 4);
        const prices = topProjects.map((project) => +project.price || 0);
        const projectNames = topProjects.map((project) => project.name || "Unnamed Project");
        setSeriesData(prices);
        setLabels(projectNames);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);


  const optionsexpencechart = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: { show: false },
      height: 200,
    },
    labels: labels,
    colors: ["#FF6384", "#36A2EB", "#FFCE56"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          background: "transparent",
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true },
    legend: { show: false, position: "bottom" },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  return (
    <DashboardCard>
      {loading ? (
        <Typography variant="subtitle2" color="textSecondary">
          Loading...
        </Typography>
      ) : (
        <>
          <Typography variant="h4">₹{totalPrice}</Typography>
          <Typography variant="subtitle2" color="textSecondary" mb={2}>
            Total Cost
          </Typography>
          <Chart options={optionsexpencechart} series={seriesData} type="donut" height={200} />
        </>
      )}
    </DashboardCard>
  );
};

export default Expence;
