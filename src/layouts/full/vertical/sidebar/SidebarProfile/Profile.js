import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons';

export const Profile = () => {
  const id = sessionStorage.getItem("useridsrmapp");
  const teamid = sessionStorage.getItem("loggedInUserId");

  const [userData, setUserData] = useState({
    profileName: "Admin Name",
    image: img1,
    role: "Admin",
    subRole: "",
  });

  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const handleLogout = () => {
    sessionStorage.removeItem("useridsrmapp");
    sessionStorage.removeItem("loggedInUserId");
    localStorage.removeItem("useridsrmapp");
    localStorage.removeItem("loggedInUserId");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const [userResponse, clientResponse] = await Promise.all([
          axios.get(`http://localhost:5000/user/singleuser/${id}`).catch(() => null),
          axios.get(`http://localhost:5000/client/singleclient/${id}`).catch(() => null),
        ]);

        if (userResponse?.data) {
          setUserData((prev) => ({
            ...prev,
            profileName: userResponse.data.profileName || "User Name",
            role: userResponse.data.role || prev.role,
            image: userResponse.data.image ? `http://localhost:5000/${userResponse.data.image}` : prev.image,
          }));
        }

        if (clientResponse?.data?.client) {
          setUserData((prev) => ({
            ...prev,
            profileName: clientResponse.data.client.profileName || prev.profileName,
            role: "client", // Explicitly marking as client
            image: clientResponse.data.client.image ? `http://localhost:5000/${clientResponse.data.client.image}` : prev.image,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamid) return;

      try {
        const teamResponse = await axios.get(`http://localhost:5000/team/singleteam/${teamid}`);

        if (teamResponse?.data?.teamMember) {
          setUserData((prev) => ({
            ...prev,
            profileName: teamResponse.data.teamMember.profileName || prev.profileName,
            role: "Team", // Explicitly marking as team
            subRole: teamResponse.data.teamMember.subrole?.name || prev.subRole,
            image: teamResponse.data.teamMember.image 
              ? `http://localhost:5000/${teamResponse.data.teamMember.image}` 
              : prev.image,
          }));
        }
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };

    fetchTeamData();
  }, [teamid]);

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: 'secondary.light' }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt={userData.name} src={userData.image} />

          <Box>
        
            <Typography variant="h6" color="textPrimary"> {userData.role === "Client" ? userData.clientname : userData.profileName}</Typography>
         
            {/* Show role/subRole based on conditions */}
            {userData.role !== "client" && (
              <Typography variant="caption" color="textSecondary">
                {userData.role === "Team" ? userData.subRole : userData.role}
              </Typography>
            )}
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" onClick={handleLogout} aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
