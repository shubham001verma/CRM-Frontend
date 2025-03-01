import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

import TopCards from '../../components/dashboards/modern/TopCards';
import RevenueUpdates from '../../components/dashboards/modern/RevenueUpdates';
import YearlyBreakup from '../../components/dashboards/modern/YearlyBreakup';
import MonthlyEarnings from '../../components/dashboards/modern/MonthlyEarnings';
import EmployeeSalary from '../../components/dashboards/modern/EmployeeSalary';
import Customers from '../../components/dashboards/modern/Customers';
import Projects from '../../components/dashboards/modern/Projects';
import Social from '../../components/dashboards/modern/Social';
import SellingProducts from '../../components/dashboards/modern/SellingProducts';
import WeeklyStats from '../../components/dashboards/modern/WeeklyStats';
import TopPerformers from '../../components/dashboards/modern/TopPerformers';
import Welcome from 'src/layouts/full/shared/welcome/Welcome';
import TopTeamCards from '../../components/dashboards/modern/TopTeamCards';
import API_BASE_URL from "../../components/Config";
import EmployeeSalaryTeam from '../../components/dashboards/modern/EmployeeSalaryTeam';
import Clockinout from '../../components/dashboards/modern/Clockinout';
import Attendance from '../../components/dashboards/modern/Attendance';
const Modern = () => {
  const teamId = sessionStorage.getItem("loggedInUserId");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        const userRole = response.data.teamMember.role;
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchPermission();
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* column */}
        <Grid size={12}>
          {role === "Team" ? <TopTeamCards /> : <TopCards />}
        </Grid>
        
        {/* column */}
        {!role || role !== "Team" ? (
          <>
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
          </>
        ) : null}

        {/* Always Show EmployeeSalary for "Team" Role */}
        <Grid size={{ xs: 12, lg: 4 }}>
        {role === "Team" ?     <EmployeeSalaryTeam/>     :<EmployeeSalary />}
       
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
        <Grid sx={{ mb: 3 }} >

<Grid size={12}   >
{role === "Team" ?    <Clockinout />: 
<Social />
}
</Grid>

 

</Grid>
  <Grid spacing={3} container columns={{ xs: 12, sm: 6 }}>
    {/* Customers and Projects are always shown */}
    <Grid size={{ xs: 12, md: 6, lg: 'grow' }}>
      <Customers />
    </Grid>
    <Grid size={{ xs: 12, md: 6, lg: 'grow' }}>
      <Projects />
    </Grid>

    {/* Other components are conditionally rendered */}
   
    
  
  </Grid>
</Grid>

{/* Other components (conditionally rendered) */}

  
    <Grid size={{ xs: 12, lg: 4 }}>
    {role === "Team" ?    <Attendance />: <WeeklyStats />
    // <SellingProducts />
    }
      
    </Grid>
    {/* <Grid size={{ xs: 12, lg: 4 }}>
      <WeeklyStats />
    </Grid> */}
    {!role || role == "Team" ? (
      <>
    <Grid size={{ xs: 12, lg: 8 }}>
      <TopPerformers />
    </Grid>
  </>
) : null} 

      </Grid>
      
      <Welcome />
    </Box>
  );
};

export default Modern;
