import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';

const RevenueUpdates = () => {
  const [month, setMonth] = useState('1');

  // Static data instead of API
  const earningsData = [
    { date: '16/08', paymentReceived: 10000, totalInvoiced: 2000 },
    { date: '17/08', paymentReceived: 7000, totalInvoiced: 3000 },
    { date: '18/08', paymentReceived: 6000, totalInvoiced: 2500 },
    { date: '19/08', paymentReceived: 5500, totalInvoiced: 2700 },
    { date: '20/08', paymentReceived: 8000, totalInvoiced: 3500 },
    { date: '21/08', paymentReceived: 7500, totalInvoiced: 4000 },
    { date: '22/08', paymentReceived: 9000, totalInvoiced: 4500 },
  ];

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.paymentReceived, 0);
  const totalExpenses = earningsData.reduce((sum, item) => sum + item.totalInvoiced, 0);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionscolumnchart = {
  chart: {
    type: 'bar',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    foreColor: '#adb0bb',
    toolbar: { show: true },
    height: 370,
    stacked: true,
  },
  colors: [primary, secondary],
  plotOptions: {
    bar: {
      horizontal: false,
      barHeight: '100%',
      columnWidth: '30%',
    
    },
  },
  stroke: { show: false },
  dataLabels: { enabled: false },
  legend: { show: false },
  grid: {
    borderColor: 'rgba(0,0,0,0.1)',
    strokeDashArray: 3,
  },
  yaxis: { 
    min: Math.min(-totalExpenses, -5), 
    max: Math.max(totalEarnings, 5), 
    tickAmount: 4 
  },
  xaxis: {
    categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08'],
  },
  tooltip: {
    theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
  },
};


  const seriescolumnchart = [
    { name: 'Earnings this month', data: earningsData.map(item => item.paymentReceived) },
    { name: 'Expense this month', data: earningsData.map(item => item.totalInvoiced) },
  ];

  return (
    <DashboardCard
      title="Revenue Updates"
      subtitle="Overview of Profit"
      action={
        <CustomSelect labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleChange}>
          <MenuItem value={1}>March 2024</MenuItem>
          <MenuItem value={2}>Feb 2024</MenuItem>
          <MenuItem value={3}>Jan 2024</MenuItem>
        </CustomSelect>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Box className="rounded-bars">
            <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="370px" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box width={40} height={40} bgcolor="primary.light" display="flex" alignItems="center" justifyContent="center">
                <Typography color="primary" variant="h6">
                  <IconGridDots width={21} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700">₹{totalEarnings.toFixed(2)}</Typography>
                <Typography variant="subtitle2" color="textSecondary">Total Earnings</Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack spacing={3} my={5}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primary, mt: 1 }} />
              <Box>
                <Typography variant="subtitle1" color="textSecondary">Earnings this month</Typography>
                <Typography variant="h5">₹{totalEarnings.toFixed(2)}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ width: 9, height: 9, bgcolor: secondary, mt: 1 }} />
              <Box>
                <Typography variant="subtitle1" color="textSecondary">Expense this month</Typography>
                <Typography variant="h5">₹{totalExpenses.toFixed(2)}</Typography>
              </Box>
            </Stack>
          </Stack>
          <Button color="primary" variant="contained" fullWidth>View Full Report</Button>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;

