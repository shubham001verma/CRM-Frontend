import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import API_BASE_URL from "../../Config";

const Projects = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const successlight = theme.palette.success.light;
  const userId = sessionStorage.getItem('useridsrmapp'); 
  const [totalProjects, setTotalProjects] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/project/getprojectbyuserid/${userId}`);
        console.log("API Response:", response.data);

        const projects = response.data.data || [];
        setTotalProjects(projects.length);
        const limitedProjects = projects.slice(0, 5);
        const names = limitedProjects.map((proj) => proj.name); 
        const data = limitedProjects.map(() => 1);

        setProjectNames(names);
        setChartData(data);

      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };

    fetchProjects();
  }, [userId]);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
    },
    colors: [primary],
    grid: { show: false },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2.1,
      colors: ['rgba(0,0,0,0.01)'],
    },
    xaxis: {
      labels: { show: true, rotate: -45 },
      categories: projectNames,
    },
    yaxis: { labels: { show: false } },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [{ name: 'Projects', data: chartData }];

  return (
    <DashboardCard>
      <Typography variant="subtitle2" color="textSecondary">
        Projects
      </Typography>
      <Typography variant="h4">{totalProjects}</Typography>
      <Stack direction="row" spacing={1} my={1} alignItems="center">
        <Avatar sx={{ bgcolor: successlight, width: 24, height: 24 }}>
          <IconArrowUpLeft width={18} color="#39B69A" />
        </Avatar>
        <Typography variant="subtitle2" fontWeight="600">
          +9%
        </Typography>
      </Stack>
      <Box>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="75px" />
      </Box>
    </DashboardCard>
  );
};

export default Projects;
