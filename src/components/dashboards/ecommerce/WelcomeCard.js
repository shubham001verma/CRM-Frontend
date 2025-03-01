import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Card, CardContent, Divider, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconArrowUpRight } from '@tabler/icons';
import axios from 'axios';
import welcomeImg from 'src/assets/images/backgrounds/welcome-bg2.png';
import userImg from 'src/assets/images/profile/user-1.jpg';
import API_BASE_URL from "../../Config";
const WelcomeCard = () => {
  const [data, setData] = useState([]);
  const [dataCounts, setDataCounts] = useState({
    totalProjects: 0,
    totalTasks: 0,
  });
  const userId = sessionStorage.getItem("useridsrmapp");
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/singleclient/${userId}`);
        console.log(response);
        const data = response.data.client
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPermission();
  }, []);
  useEffect(() => {
    fetchTotalProjects();
    fetchTotalTasks();
  }, [])
  const fetchTotalProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/project/countprojectsbyclientid/${userId}`);
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
      const response = await axios.get(`${API_BASE_URL}/task/counttaskforclient/${userId}`);
      setDataCounts(prevState => ({
        ...prevState,
        totalTasks: response.data.count || 0,
      }));
    } catch (error) {
      console.error('Error fetching total tasks:', error.message);
    }
  };
  const { totalProjects, totalTasks } = dataCounts;
  return (
    <Card
      elevation={0}
      sx={{ backgroundColor: (theme) => theme.palette.primary.light, py: 0, position: 'relative' }}
    >
      <CardContent sx={{ py: 4, px: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid size={{ sm: 6 }} display="flex" alignItems="center">
            <Box>
              <Box
                gap="16px"
                mb={5}
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'flex',
                  },
                  alignItems: 'center',
                }}
              >
                <Avatar src={data.image ? `${API_BASE_URL}/${data.image}` : userImg} alt="img" sx={{ width: 40, height: 40 }} />
                <Typography variant="h5" whiteSpace="nowrap">
                  Welcome back {data.clientname?.owner ? data.clientname?.owner : 'null'}!
                </Typography>
              </Box>
              <Stack
                mt={7}
                spacing={2}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    {totalProjects}
                    <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    My Projects
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    {totalTasks}
                    <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Running Tasks
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ sm: 6 }}>
            <Box
              sx={{
                width: '340px',
                height: '246px',
                position: 'absolute',
                right: '-26px',
                bottom: '-70px',
                marginTop: '20px',
              }}
            >
              <img src={welcomeImg} alt={welcomeImg} width={'340px'} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
