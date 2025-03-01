import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowDownRight } from '@tabler/icons';
import Grid from '@mui/material/Grid2';

import DashboardCard from '../../shared/DashboardCard';

const YearlyBreakup = () => {
  const userId = sessionStorage.getItem('useridsrmapp');
  const [yearlyDuePayments, setYearlyDuePayments] = useState({});
  const [chartLabels, setChartLabels] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const errorlight = theme.palette.error.light;

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/client/getclientsbyuserid/${userId}`);
      const data = response.data.data;

      const dueByYear = {};

      data.forEach(client => {
        const year = new Date(client.createdAt).getFullYear();
        const invoicedPayments = client.totalinvoiced || 0;
        const receivedPayments = client.paymentReceived || 0;
        const dueAmount = invoicedPayments - receivedPayments;

        if (!dueByYear[year]) {
          dueByYear[year] = 0;
        }
        dueByYear[year] +=+ dueAmount;
      });

      setYearlyDuePayments(dueByYear);
      setChartLabels(Object.keys(dueByYear).map(year => year.toString())); 
      setChartSeries(Object.values(dueByYear)); 
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    labels: chartLabels,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: 'bottom',
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  return (
    <DashboardCard title="Due Payment">
      <Grid container spacing={3}>
        <Grid size={7}>
          <Typography variant="h3" fontWeight="700">
            ₹{Object.values(yearlyDuePayments).reduce((acc, val) => acc + val, 0)}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
              <IconArrowDownRight width={20} color="#FA896B" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              +9%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              last year
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            {chartLabels.map((year, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }} />
                <Typography variant="subtitle2" color="textSecondary">
                  {year}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid size={5}>
          <Box>
            <Chart
              options={optionscolumnchart}
              series={chartSeries}
              type="donut"
              height="130px"
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
