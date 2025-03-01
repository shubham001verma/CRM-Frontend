import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import { IconGridDots } from '@tabler/icons';
import API_BASE_URL from '../../Config';

const WeeklyStats = () => {
  const userId = sessionStorage.getItem('useridsrmapp'); 
  const [dataCounts, setDataCounts] = useState({
    totalLeads: 0,
    totalWonLeads: 0,
    totalLostLeads: 0,
  });

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const [totalLeadsRes, wonLeadsRes, lostLeadsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/lead/countledsbyuserid/${userId}`),
          axios.get(`${API_BASE_URL}/lead/countwonledsbyuserid/${userId}`),
          axios.get(`${API_BASE_URL}/lead/countlostledsbyuserid/${userId}`),
        ]);

        setDataCounts({
          totalLeads: totalLeadsRes.data.count || 0,
          totalWonLeads: wonLeadsRes.data.totalWonLeads || 0,
          totalLostLeads: lostLeadsRes.data.totalLostLeads || 0,
        });
      } catch (error) {
        console.error('Error fetching lead data:', error.message);
      }
    };
    fetchLeadsData();
  }, [userId]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;

 
  const monthlyData = [
    dataCounts.totalLeads,
    dataCounts.totalWonLeads,
    dataCounts.totalLostLeads,
  ];

 
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: { size: 0 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: { show: false },
    },
  };


  const seriescolumnchart = [
    {
      name: 'Leads Data',
      color: secondary,
      data: monthlyData, 
    },
  ];

 
  const stats = [
    {
      title: 'Total Leads',
      subtitle: 'Leads Assigned',
      percent: dataCounts.totalLeads,
      color: primary,
      lightcolor: primarylight,
      icon: <IconGridDots width={18} />,
    },
    {
      title: 'Won Leads',
      subtitle: 'Successfully Closed',
      percent: dataCounts.totalWonLeads,
      color: secondary,
      lightcolor: secondarylight,
      icon: <IconGridDots width={18} />,
    },
    {
      title: 'Lost Leads',
      subtitle: 'Leads Not Converted',
      percent: dataCounts.totalLostLeads,
      color: error,
      lightcolor: errorlight,
      icon: <IconGridDots width={18} />,
    },
  ];

  return (
    <DashboardCard title="Lead Status" subtitle="Average Leads">
      <Stack mt={4}>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="130px" />
      </Stack>
      <Stack spacing={3} mt={3}>
        {stats.map((stat, i) => (
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" key={i}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar variant="rounded" sx={{ bgcolor: stat.lightcolor, color: stat.color, width: 40, height: 40 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" mb="4px">
                  {stat.title}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {stat.subtitle}
                </Typography>
              </Box>
            </Stack>
            <Avatar sx={{ bgcolor: stat.lightcolor, color: stat.color, width: 42, height: 24, borderRadius: '4px' }}>
              <Typography variant="subtitle2" fontWeight="600">
                +{stat.percent}
              </Typography>
            </Avatar>
          </Stack>
        ))}
      </Stack>
    </DashboardCard>
  );
};

export default WeeklyStats;
