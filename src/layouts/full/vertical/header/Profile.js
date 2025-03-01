import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { IconMail } from '@tabler/icons';
import { Stack } from '@mui/system';
import axios from 'axios';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import * as dropdownData from './data';
import API_BASE_URL from "../../../../components/Config";
const Profile = () => {
  const id = sessionStorage.getItem("useridsrmapp");
  const teamid = sessionStorage.getItem("loggedInUserId");

  const [userData, setUserData] = useState({
    profileName: "Admin Name",
    image: ProfileImg,
    role: "Admin",
    subRole: "",
    email: "",
  });
  const [anchorEl2, setAnchorEl2] = useState(null);
  
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const [userResponse, clientResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/singleuser/${id}`).catch(() => null),
          axios.get(`${API_BASE_URL}/client/singleclient/${id}`).catch(() => null),
        ]);

        if (userResponse?.data) {
          setUserData((prev) => ({
            ...prev,
            profileName: userResponse.data.profileName || "User Name",
            role: userResponse.data.role?.toLowerCase() || prev.role,
            image: userResponse.data.image ? `${API_BASE_URL}/${userResponse.data.image}` : prev.image,
            email: userResponse.data.email || prev.email,
          }));
        }

        if (clientResponse?.data?.client) {
          setUserData((prev) => ({
            ...prev,
            profileName: clientResponse.data.client.profileName || prev.profileName,
            role: "client",
            image: clientResponse.data.client.image ? `${API_BASE_URL}/${clientResponse.data.client.image}` : prev.image,
            email: clientResponse.data.client.email || prev.email,
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
        const teamResponse = await axios.get(`${API_BASE_URL}/team/singleteam/${teamid}`);

        if (teamResponse?.data?.teamMember) {
          setUserData((prev) => ({
            ...prev,
            profileName: teamResponse.data.teamMember.profileName || prev.profileName,
            role: "team",
            subRole: teamResponse.data.teamMember.subrole?.name || prev.subRole,
            image: teamResponse.data.teamMember.image
              ? `${API_BASE_URL}/${teamResponse.data.teamMember.image}`
              : prev.image,
            email: teamResponse.data.teamMember.email || prev.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };

    fetchTeamData();
  }, [teamid]);


  const handleLogout = () => {
    sessionStorage.removeItem("useridsrmapp");
    sessionStorage.removeItem("loggedInUserId");
    localStorage.removeItem("useridsrmapp");
    localStorage.removeItem("loggedInUserId");
    window.location.href = "/";
  };

  return (
    <Box>
      <IconButton size="large" color="inherit" aria-controls="profile-menu" aria-haspopup="true" onClick={handleClick2}>
        <Avatar src={userData.image} alt={userData.name} sx={{ width: 35, height: 35 }} />
      </IconButton>
      <Menu
          id="msgs-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          sx={{ '& .MuiMenu-paper': { width: '360px' } }}
        >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar alt={userData.name} src={userData.image} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="h6" color="textPrimary">{userData.profileName}</Typography>
                {userData.role !== "client" && (
                  <Typography variant="caption" color="textSecondary">
                    {userData.role === "team" ? userData.subRole : userData.role}
                  </Typography>
                )}
                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                  <IconMail width={15} height={15} />
                  {userData.email || "No Email"}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            {dropdownData.profile.map((profile) => (
                <Box key={profile.title}  onClick={() => (window.location.href = profile.href)} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
                   
                      <Stack direction="row" spacing={2}>
                        <Box width="45px" height="45px" bgcolor="primary.light" display="flex" alignItems="center" justifyContent="center">
                          <Avatar src={profile.icon} alt={profile.icon} sx={{ width: 24, height: 24, borderRadius: 0 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} color="textPrimary" noWrap sx={{ width: '240px' }}>{profile.title}</Typography>
                          <Typography color="textSecondary" variant="subtitle2" sx={{ width: '240px' }} noWrap>{profile.subtitle}</Typography>
                        </Box>
                      </Stack>
                  
                  </Box>
                </Box>
              ))}
            <Box mt={2}>
              <Button variant="outlined" color="primary" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
