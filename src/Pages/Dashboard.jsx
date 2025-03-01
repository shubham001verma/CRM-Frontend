// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Components/Card'
import icon1 from '../assets/svgs/icon-connect.svg';
import icon2 from '../assets/svgs/icon-user-male.svg';
import icon3 from '../assets/svgs/icon-briefcase.svg';
import icon4 from '../assets/svgs/icon-mailbox.svg';
import icon5 from '../assets/svgs/icon-favorites.svg';
import icon6 from '../assets/svgs/icon-speech-bubble.svg';





import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

import TopCards from '../Components/modern/TopCards';
import RevenueUpdates from '../Components/modern/RevenueUpdates';
import YearlyBreakup from '../Components/modern/YearlyBreakup';
import MonthlyEarnings from '../Components/modern/MonthlyEarnings';
import EmployeeSalary from '../Components/modern/EmployeeSalary';
import Customers from '../Components/modern/Customers';
import Projects from '../Components/modern/Projects';
import Social from '../Components/modern/Social';
import SellingProducts from '../Components/modern/SellingProducts';
import WeeklyStats from '../Components/modern/WeeklyStats';
import TopPerformers from '../Components/modern/TopPerformers';
import Welcome from '..//layouts/full/shared/welcome/Welcome';




function Dashboard() {
  const userId = sessionStorage.getItem('useridsrmapp');
  const [earning, setEarning] = useState([]);
  const [dataCounts, setDataCounts] = useState({
    totalLeads: 0,
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalMembers: 0,

  });
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);



  useEffect(() => {
    const fetchData = async (endpoint, field) => {
      try {
        const response = await axios.get(endpoint);
        setDataCounts(prevState => ({
          ...prevState,
          [field]: response.data.count || 0,
        }));
      } catch (error) {
        console.error(`Error fetching ${field}:`, error.message);
      }
    };

    fetchData(`http://localhost:5000/lead/countledsbyuserid/${userId}`, 'totalLeads');
    fetchData(`http://localhost:5000/client/countclientsbyuserid/${userId}`, 'totalClients');
    fetchData(`http://localhost:5000/project/countprojectsbyuserid/${userId}`, 'totalProjects');
    fetchData(`http://localhost:5000/task/counttasksbyuserid/${userId}`, 'totalTasks');
    fetchData(`http://localhost:5000/team/getcountteammemberbyuserid/${userId}`, 'totalMembers');
  }, [userId]);

  const { totalLeads, totalClients, totalProjects, totalTasks, totalMembers } = dataCounts;

  const fetchearning = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/client/getclientsbyuserid/${userId}`);
      console.log(response.data.data);
      setEarning(response.data.data);


      let totalEarningValue = 0;
      let totalExpenseValue = 0;

      response.data.data.forEach(client => {

        totalEarningValue += client.paymentReceived || 0;
        totalExpenseValue += client.totalInvoiced || 0;
      });

      setTotalEarning(totalEarningValue);
      setTotalExpense(totalExpenseValue);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchearning();
  }, [userId]);


  return (
    <div className="container my-4">
      <div className="row g-4">
        <Card
          title="Employees"
          count={totalMembers}
          imageUrl={icon2}
          bgColor="#eef2ff"
          textColor="#6b5bfc"
        />
        <Card
          title="Clients"
          count={totalClients}
          imageUrl={icon3}
          bgColor="#fff5e5"
          textColor="#ff9800"
        />
        <Card
          title="Projects"
          count={totalProjects}
          imageUrl={icon4}
          bgColor="#e5f7ff"
          textColor="#03a9f4"
        />
        <Card
          title="Tasks"
          count={totalTasks}
          imageUrl={icon5}
          bgColor="#ffebeb"
          textColor="#f44336"
        />
        <Card
          title="Leads"
          count={totalLeads}
          imageUrl={icon6}
          bgColor="#e5fff7"
          textColor="#00c853"
        />
        <Card
          title="Reports"
          count={totalMembers}
          imageUrl={icon1}
          bgColor="#edf3ff"
          textColor="#6b5bfc"
        />
      </div>
      <Box>
        <Grid container spacing={3}>

          <Grid size={12}>
            <TopCards />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <RevenueUpdates />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Grid spacing={3} container columns={{ xs: 12, sm: 6 }}>
              <Grid size={12}>
                <YearlyBreakup />
              </Grid>
              <Grid size={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <EmployeeSalary />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Grid spacing={3} container columns={{ xs: 12, sm: 6 }}>
              <Grid size={{ xs: 12, md: 6, lg: 'grow' }}>
                <Customers />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 'grow' }}>
                <Projects />
              </Grid>
              <Grid size={12}>
                <Social />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <SellingProducts />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <WeeklyStats />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <TopPerformers />
          </Grid>
        </Grid>

        <Welcome />
      </Box>
    </div>


  );
}

export default Dashboard;








