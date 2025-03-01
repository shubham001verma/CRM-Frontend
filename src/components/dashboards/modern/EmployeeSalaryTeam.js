import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import axios from "axios";
import DashboardWidgetCard from "../../shared/DashboardWidgetCard";
import API_BASE_URL from "../../Config";

const EmployeeSalaryTeam = () => {
  const theme = useTheme();
  const userId = sessionStorage.getItem("loggedInUserId");
  const [teamData, setTeamData] = useState({ fixedSalary: 0, finalSalary: 0 });
  const [monthlySalaries, setMonthlySalaries] = useState([0, 0, 0]);

  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];

  const currentMonthIndex = new Date().getMonth();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthLabels = [
    months[(currentMonthIndex - 1 + 12) % 12], 
    months[currentMonthIndex],                 
    months[(currentMonthIndex + 1) % 12],       
    months[(currentMonthIndex + 2) % 12],  
  ];

  const fetchTeamData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/team/singleteam/${userId}`);

      if (response.data && response.data.teamMember) {
        const team = response.data.teamMember;
        
      
        const salaries = [
          team.prevMonthSalary || 0,         
          team.finalSalary || 0,            
          team.nextMonthSalary || 0         
        ];

        setTeamData({
          fixedSalary: team.fixedSalary || 0,
          finalSalary: team.finalSalary || 0
        });

        setMonthlySalaries(salaries);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: false },
      height: 280
    },
    colors: monthLabels.map((_, index) => (index === 1 ? primary : primarylight)), 
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "35%",
        distributed: true
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { yaxis: { lines: { show: false } } },
    xaxis: {
      categories: monthLabels,
      axisBorder: { show: false }
    },
    yaxis: { labels: { show: false } },
    tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light" }
  };

  const seriescolumnchart = [
    {
      name: "Salary",
      data: monthlySalaries
    }
  ];

  return (
    <DashboardWidgetCard
      title="Employee Salary"
      subtitle="Monthly Overview"
      dataLabel1="Fixed Salary"
      dataItem1={`₹${teamData.fixedSalary.toLocaleString()}`}
      dataLabel2="Final Salary"
      dataItem2={`₹${teamData.finalSalary.toFixed(3)}`}
    >
      <Box>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="280px" />
      </Box>
    </DashboardWidgetCard>
  );
};

export default EmployeeSalaryTeam;
