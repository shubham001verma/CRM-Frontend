import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, Stack, Typography, Avatar, Box, TextField } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import API_BASE_URL from "../../Config";
const RevenueUpdates = () => {
  const userId = sessionStorage.getItem('useridsrmapp')
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const [chartData, setChartData] = useState({
    categories: [],
    earnings: [],
    expenses: [],
  });
  const [month, setMonth] = useState('1');
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/client/getclientsbyuserid/${userId}`);
      console.log(response);
      const data = response.data.data;

      let totalEarningValue = 0;
      let totalExpenseValue = 0;
      let currentMonthEarnings = 0;
      let currentMonthExpenses = 0;

      const currentMonth = new Date().getMonth() + 1;
      const filteredData = selectedDate
        ? data.filter(client => new Date(client.createdAt).toISOString().split('T')[0] === selectedDate)
        : data;

      const latestFiveClients = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);


      const latestEarnings = latestFiveClients.map(client => client.paymentReceived || 0);
      const latestExpenses = latestFiveClients.map(client => client.totalexpense || 0);
      const latestDates = latestFiveClients.map(client => new Date(client.createdAt).toLocaleDateString());

      filteredData.forEach(client => {
        const earnings = client.paymentReceived || 0;
        const expenses = client.totalexpense || 0;
        totalEarningValue += +earnings;
        totalExpenseValue += +expenses;

        const clientMonth = new Date(client.createdAt).getMonth() + 1;
        if (clientMonth === currentMonth) {
          currentMonthEarnings += +earnings;
          currentMonthExpenses += +expenses;
        }
      });

      setTotalEarning(totalEarningValue);
      setTotalExpense(totalExpenseValue);
      setMonthlyEarnings(currentMonthEarnings);
      setMonthlyExpenses(currentMonthExpenses);

      setChartData({
        categories: latestDates,
        earnings: latestEarnings,
        expenses: latestExpenses.map(expense => -expense),
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [userId, selectedDate]);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: true },
      height: 370,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '10%',
        borderRadius: 6,
      },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [
    { name: 'Earnings', data: chartData.earnings },
    { name: 'Expenses', data: chartData.expenses },
  ];

  return (
    <DashboardCard
      title="Revenue Updates"
      subtitle="Overview of Profit"
      action={
        <TextField
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          size="small"
        />
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="370px"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="primary" variant="h6" display="flex">
                  <IconGridDots width={21} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700">
                  ₹{totalEarning}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Earnings
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack spacing={3} my={5}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  mt: 1,
                }}
              />
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Earnings this month
                </Typography>
                <Typography variant="h5">₹{monthlyEarnings}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: secondary,
                  mt: 1,
                }}
              />
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Expenses this month
                </Typography>
                <Typography variant="h5">₹{monthlyExpenses}</Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;
