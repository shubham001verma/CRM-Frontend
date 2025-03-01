import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import axios from "axios";
import DashboardWidgetCard from "../../shared/DashboardWidgetCard";
import API_BASE_URL from "../../Config";

const EmployeeSalary = () => {
  const theme = useTheme();
  const userId = sessionStorage.getItem("useridsrmapp");
  const [salaryData, setSalaryData] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [monthlySalaryData, setMonthlySalaryData] = useState([0, 0, 0, 0, 0]);

  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];

  const currentMonthIndex = new Date().getMonth();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const monthLabels = [
    months[(currentMonthIndex - 2 + 12) % 12], 
    months[(currentMonthIndex - 1 + 12) % 12], 
    months[currentMonthIndex],                
    months[(currentMonthIndex + 1) % 12],      
    months[(currentMonthIndex + 2) % 12],      
  ];

  const fetchTeamData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/salary/salarybyuserid/${userId}`
      );
      const salary = response.data;

      let salaryByMonth = [0, 0, 0, 0, 0];

      salary.forEach((salary) => {
        const salaryAmount = salary.finalSalary || 0;
        const salaryMonth = new Date(salary.createdAt).getMonth();

        for (let i = 0; i < 5; i++) {
          if (salaryMonth === (currentMonthIndex - 2 + i + 12) % 12) {
            salaryByMonth[i] +=+ salaryAmount;
          }
        }
      });

      setTotalSalary(salaryByMonth[2]); 
      setMonthlySalaryData(salaryByMonth);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/client/getclientsbyuserid/${userId}`
      );
      const data = response.data.data;
      let currentMonthEarnings = 0;
      const currentMonth = new Date().getMonth();

      data.forEach((client) => {
        const earnings = client.paymentReceived || 0;
        const clientMonth = new Date(client.createdAt).getMonth();
        if (clientMonth === currentMonth) {
          currentMonthEarnings += +earnings;
        }
      });

      setMonthlyEarnings(currentMonthEarnings);
    } catch (err) {
      console.error("Error fetching earnings data:", err);
    }
  };

  useEffect(() => {
    fetchTeamData();
    fetchEarnings();
  }, []);

  const profit = monthlyEarnings - totalSalary;

  return (
    <DashboardWidgetCard
      title="Employee Salary"
      subtitle="Monthly Overview"
      dataLabel1="Salary"
      dataItem1={`₹${totalSalary.toLocaleString()}`}
      dataLabel2="Profit"
      dataItem2={`₹${profit.toLocaleString()}`}
    >
      <Box>
        <Chart
          options={{
            chart: {
              type: "bar",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              foreColor: "#adb0bb",
              toolbar: { show: false },
              height: 280,
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                columnWidth: "45%",
                distributed: true,
              },
            },
            colors: monthLabels.map((_, index) =>
              index === 2 ? primary : primarylight
            ),
            dataLabels: { enabled: false },
            legend: { show: false },
            grid: { yaxis: { lines: { show: false } } },
            xaxis: {
              categories: monthLabels,
              axisBorder: { show: false },
            },
            yaxis: { labels: { show: false } },
            tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light" },
          }}
          series={[
            {
              name: "Salary",
              data: monthlySalaryData,
            },
          ]}
          type="bar"
          height="280px"
        />
      </Box>
    </DashboardWidgetCard>
  );
};

export default EmployeeSalary;
