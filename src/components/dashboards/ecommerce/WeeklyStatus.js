import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import { IconGridDots } from '@tabler/icons';
import API_BASE_URL from '../../Config';

const WeeklyStatus = () => {
  const userId = sessionStorage.getItem('useridsrmapp'); 
  const [dataCounts, setDataCounts] = useState({
    totalProjects: 0,
    totalCompletedProjects: 0,
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [totalProjectsRes, completedProjectsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/project/countprojectsbyclientid/${userId}`),
          axios.get(`${API_BASE_URL}/project/countcompletedprojectsbyclientid/${userId}`),
        ]);

        setDataCounts({
          totalProjects: totalProjectsRes.data.count || 0,
          totalCompletedProjects: completedProjectsRes.data.count || 0,
        });
      } catch (error) {
        console.error('Error fetching project data:', error.message);
      }
    };
    fetchProjectData();
  }, [userId]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;

  const monthlyData = [
    dataCounts.totalProjects, 
    dataCounts.totalCompletedProjects, 
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
      name: 'Project Data',
      color: secondary,
      data: monthlyData, 
    },
  ];
  const stats = [
    {
      title: 'Total Projects',
      subtitle: 'Total Assigned',
      percent: dataCounts.totalProjects,
      color: primary,
      lightcolor: primarylight,
      icon: <IconGridDots width={18} />,
    },
    {
      title: 'Completed Projects',
      subtitle: 'Successfully Finished',
      percent: dataCounts.totalCompletedProjects,
      color: secondary,
      lightcolor: secondarylight,
      icon: <IconGridDots width={18} />,
    },
  ];

  return (
    <DashboardCard title="Project Status" subtitle="Overview of Projects">
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
                {stat.percent}
              </Typography>
            </Avatar>
          </Stack>
        ))}
      </Stack>
    </DashboardCard>
  );
};

export default WeeklyStatus;
