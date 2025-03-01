import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowDownRight } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import API_BASE_URL from "../../Config";

const Customers = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const errorlight = theme.palette.error.light;
  const userId = sessionStorage.getItem('useridsrmapp'); 
  const [totalClients, setTotalClients] = useState(0);
  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    const fetchTotalClients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/countclientsbyuserid/${userId}`);
        setTotalClients(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching total clients:', error.message);
      }
    };

    const fetchClientData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/getclientsbyuserid/${userId}`);
        const clients = response.data.data;
        const monthlyData = clients.reduce((acc, client) => {
          const month = new Date(client.createdAt).getMonth(); 
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Array(6).fill(0).map((_, i) => monthlyData[i] || 0);
        setClientData(formattedData);
      } catch (error) {
        console.error('Error fetching client data:', error.message);
      }
    };

    fetchTotalClients();
    fetchClientData();
  }, [userId]);

  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 80,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: { colors: [secondarylight], type: 'solid', opacity: 0.05 },
    markers: { size: 0 },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light', x: { show: false } },
  };

  const seriescolumnchart = [{ name: 'Clients', color: secondary, data: clientData }];

  return (
    <DashboardCard
      footer={<Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="80px" />}
    >
      <Typography variant="subtitle2" color="textSecondary">Customers</Typography>
      <Typography variant="h4">{totalClients}</Typography>
      <Stack direction="row" spacing={1} mt={1} alignItems="center">
        <Avatar sx={{ bgcolor: errorlight, width: 24, height: 24 }}>
          <IconArrowDownRight width={18} color="#FA896B" />
        </Avatar>
        <Typography variant="subtitle2" fontWeight="600">+9%</Typography>
      </Stack>
    </DashboardCard>
  );
};

export default Customers;

