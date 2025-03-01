import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  CardMedia,
  styled,
  Fab,
  Skeleton,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import axios from 'axios';
import profilecover from 'src/assets/images/backgrounds/profilebg.jpg';
import userimg from 'src/assets/images/profile/user-1.jpg';

import {
  IconBrandDribbble,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandLinkedin,
} from '@tabler/icons';

import ProfileTab from './ProfileTab';
import BlankCard from '../../../shared/BlankCard';
import API_BASE_URL from "../../../Config";
const ProfileBanner = () => {
  const id = sessionStorage.getItem("useridsrmapp");
  const teamid = sessionStorage.getItem("loggedInUserId");

  const [userData, setUserData] = useState({
    profileName: "Admin Name",
    image: userimg,
    role: "Admin",
    subRole: "",
  });
  console.log(userData._id)
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
            id: userResponse.data._id,
            profileName: userResponse.data.profileName || "User Name",
            role: userResponse.data.role?.toLowerCase() || prev.role,
            image: userResponse.data.image ? `${API_BASE_URL}/${userResponse.data.image}` : prev.image,
          }));
        }

        if (clientResponse?.data?.client) {
          setUserData((prev) => ({
            ...prev,
            id: clientResponse.data.client._id,
            profileName: clientResponse.data.client.profileName || prev.profileName,
            role: "client",
            image: clientResponse.data.client.image ? `${API_BASE_URL}/${clientResponse.data.client.image}` : prev.image,
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
            id: teamResponse.data.teamMember._id,
            profileName: teamResponse.data.teamMember.profileName || prev.profileName,
            role: "team",
            subRole: teamResponse.data.teamMember.subrole?.name || prev.subRole,
            image: teamResponse.data.teamMember.image
              ? `${API_BASE_URL}/${teamResponse.data.teamMember.image}`
              : prev.image,
          }));
        }
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };
    fetchTeamData();
  }, [teamid]);

  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  }));

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);

  }, []);

  return (
    <BlankCard>
      {isLoading ? (
        <Skeleton variant="square" animation="wave" width="100%" height={330} />
      ) : (
        <CardMedia component="img" image={profilecover} alt="Profile Cover" width="100%" />
      )}

      <Grid container spacing={0} justifyContent="center" alignItems="center">
        <Grid size={{ lg: 4, xs: 12, md: 5, sm: 12 }}>
          {/* <Stack direction="row" textAlign="center" justifyContent="center" gap={6} m={3}>
            <Box>
              <Typography color="text.secondary">
                <IconFileDescription width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">938</Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400}>Posts</Typography>
            </Box>
            <Box>
              <Typography color="text.secondary">
                <IconUserCircle width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">3,586</Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400}>Followers</Typography>
            </Box>
            <Box>
              <Typography color="text.secondary">
                <IconUserCheck width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">2,659</Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400}>Following</Typography>
            </Box>
          </Stack> */}
          <Stack direction={'row'} gap={2} alignItems="center" justifyContent="center" my={2}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <Fab size="small" color="primary" sx={{ backgroundColor: '#1877F2' }}>
                <IconBrandFacebook size="16" />
              </Fab>
            </a>

            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <Fab size="small" color="primary" sx={{ backgroundColor: '#1DA1F2' }}>
                <IconBrandTwitter size="18" />
              </Fab>
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <Fab size="small" color="error" sx={{ backgroundColor: '#E4405F' }}>
                <IconBrandInstagram size="18" />
              </Fab>
            </a>

            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <Fab size="small" color="primary" sx={{ backgroundColor: '#0A66C2' }}>
                <IconBrandLinkedin size="18" />
              </Fab>
            </a>

            <a href="https://www.dribbble.com" target="_blank" rel="noopener noreferrer">
              <Fab size="small" color="error" sx={{ backgroundColor: '#EA4C89' }}>
                <IconBrandDribbble size="18" />
              </Fab>
            </a>

            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <Fab size="small" color="error" sx={{ backgroundColor: '#CD201F' }}>
                <IconBrandYoutube size="18" />
              </Fab>
            </a>
          </Stack>
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <Box display="flex" alignItems="center" textAlign="center" justifyContent="center" sx={{ mt: '-85px' }}>
            <Box position="relative">
              <ProfileImage>
                <Avatar
                  src={userData.image}
                  alt="User Image"
                  sx={{
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    border: '4px solid #fff',
                  }}
                />
              </ProfileImage>
              <Box mt={1} mb={2}>
                <Typography fontWeight={600} variant="h5">
                  {userData.profileName || "N/A"}
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  {userData.role === "team" ? userData.subRole : userData.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          size={{ lg: 4, xs: 12 }}
          sx={{
            order: {
              xs: '3',
              sm: '3',
              lg: '3',
            },
          }}
        >
          <Stack direction={'row'} gap={2} alignItems="center" justifyContent="center" my={2}>
            <Button color="primary" variant="contained" onClick={() => window.location.href = (`/editprofile/${userData.id}`)}>
              Edit Profile
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </BlankCard>
  );
};

export default ProfileBanner;
