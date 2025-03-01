import React, { useState, useEffect } from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';
import API_BASE_URL from "../../Config";
const TopCards = () => {
  const userId = sessionStorage.getItem('useridsrmapp');

  const [dataCounts, setDataCounts] = useState({
    totalLeads: 0,
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalMembers: 0,
    totalServices: 0
  });

  useEffect(() => {
    const fetchTotalLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead/countledsbyuserid/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalLeads: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total leads:', error.message);
      }
    };

    const fetchTotalClients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/countclientsbyuserid/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalClients: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total clients:', error.message);
      }
    };

    const fetchTotalProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/project/countprojectsbyuserid/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalProjects: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total projects:', error.message);
      }
    };

    const fetchTotalTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/task/counttasksbyuserid/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalTasks: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total tasks:', error.message);
      }
    };

    const fetchTotalMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/getcountteammemberbyuserid/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalMembers: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total members:', error.message);
      }
    };
    const fetchTotalServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/countservicesbyuserid/${userId}`);
        setDataCounts(prevState => ({
          ...prevState,
          totalServices: response.data.count || 0,
        }));
      } catch (error) {
        console.error('Error fetching total members:', error.message);
      }
    };

    fetchTotalLeads();
    fetchTotalClients();
    fetchTotalProjects();
    fetchTotalTasks();
    fetchTotalMembers();
    fetchTotalServices()
  }, []);

  const { totalLeads, totalClients, totalProjects, totalTasks, totalMembers, totalServices } = dataCounts;

  const topcards = [
    {
      icon: icon2,
      title: 'Employees',
      digits: totalMembers,
      bgcolor: 'primary',
    },
    {
      icon: icon3,
      title: 'Clients',
      digits: totalClients,
      bgcolor: 'warning',
    },
    {
      icon: icon4,
      title: 'Projects',
      digits: totalProjects,
      bgcolor: 'secondary',
    },
    {
      icon: icon5,
      title: 'Tasks',
      digits: totalTasks,
      bgcolor: 'error',
    },
    {
      icon: icon6,
      title: 'Leads',
      digits: totalLeads,
      bgcolor: 'success',
    },
    {
      icon: icon1,
      title: 'Services',
      digits: totalServices,
      bgcolor: 'info',
    },
  ];

  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={i}>
          <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
            <CardContent>
              <img src={topcard.icon} alt={topcard.icon} width="50" />
              <Typography color={topcard.bgcolor + '.main'} mt={1} variant="subtitle1" fontWeight={600}>
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
