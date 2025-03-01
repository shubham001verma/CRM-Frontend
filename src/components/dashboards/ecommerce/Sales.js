import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

import DashboardCard from "../../shared/DashboardCard";
import API_BASE_URL from "../../Config";

const Sales = () => {
  const [totalDue, setTotalDue] = useState(0);
  const [seriesData, setSeriesData] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem("useridsrmapp");
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/project/getprojectbyclientid/${userId}`
        );
        const projectData = response.data.project || [];
        const projectsWithDue = projectData.map((project) => ({
          name: project.name || "Unnamed Project",
          due: (project.price || 0) - (project.client?.paymentReceived || 0),
        }));
        const topProjects = projectsWithDue.sort((a, b) => b.due - a.due).slice(0, 4);
        const totalDueAmount = topProjects.reduce((sum, project) => sum + project.due, 0);
        setTotalDue(totalDueAmount);
        setSeriesData([{ name: "Due", data: topProjects.map((p) => p.due) }]);
        setProjectNames(topProjects.map((p) => p.name));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);
  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false },
      height: 60, 
      sparkline: { enabled: true },
    },
    colors: [primary],
    grid: { show: false },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2.1,
      colors: ["rgba(0,0,0,0.01)"],
    },
    xaxis: {
      labels: { show: true, rotate: -45 },
      categories: projectNames,
    },
    yaxis: { labels: { show: false } },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };

  return (
    <DashboardCard>
      <>
        <Typography variant="h4">₹{loading ? "Loading..." : totalDue}</Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={3}>
          Total Due
        </Typography>
        <Box className="rounded-bars">
          <Chart options={optionscolumnchart} series={seriesData} type="bar" height={90} />
        </Box>
      </>
    </DashboardCard>
  );
};

export default Sales;
