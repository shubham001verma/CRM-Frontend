import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { Stack, Typography, CircularProgress } from "@mui/material";
import ChildCard from "src/components/shared/ChildCard";
import { IconBriefcase, IconDeviceDesktop, IconMail, IconMapPin } from "@tabler/icons";
import API_BASE_URL from "../../../Config";
const IntroCard = () => {
  const [userData, setUserData] = useState({
    profileName: "Admin Name",
    email: "admin@example.com",
    phone: "N/A",
    address: "N/A",
    role: "Admin",
    subRole: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = sessionStorage.getItem("useridsrmapp");
  const teamid = sessionStorage.getItem("loggedInUserId");
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : "";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const [userResponse, clientResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/singleuser/${id}`).catch(() => null),
          axios.get(`${API_BASE_URL}/client/singleclient/${id}`).catch(() => null),
        ]);

        if (userResponse?.data) {
          setUserData((prev) => ({
            ...prev,
            profileName: userResponse.data.profileName || "User Name",
            email: userResponse.data.email || prev.email,
            phone: userResponse.data.phone || prev.phone,
            address: userResponse.data.address || prev.address,
            role: userResponse.data.role?.toLowerCase() || prev.role,
          }));
        }

        if (clientResponse?.data?.client) {
          setUserData((prev) => ({
            ...prev,
            profileName: clientResponse.data.client.profileName || prev.profileName,
            email: clientResponse.data.client.email || prev.email,
            phone: clientResponse.data.client.phone || prev.phone,
            address: clientResponse.data.client.address || prev.address,
            role: "client",
          }));
        }
      } catch (error) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamid) {
        setLoading(false);
        return;
      }
      try {
        const teamResponse = await axios.get(`${API_BASE_URL}/team/singleteam/${teamid}`);

        if (teamResponse?.data?.teamMember) {
          setUserData((prev) => ({
            ...prev,
            profileName: teamResponse.data.teamMember.profileName || prev.profileName,
            email: teamResponse.data.teamMember.email || prev.email,
            phone: teamResponse.data.teamMember.phone || prev.phone,
            address: teamResponse.data.teamMember.address || prev.address,
            role: "team",
            subRole: teamResponse.data.teamMember.subrole?.name || prev.subRole,
          }));
        }
      } catch (error) {
        setError("Error fetching team member data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamid]);

  if (loading) {
    return (
      <ChildCard>
        <CircularProgress />
      </ChildCard>
    );
  }

  if (error) {
    return (
      <ChildCard>
        <Typography color="error">{error}</Typography>
      </ChildCard>
    );
  }

  return (
    <ChildCard>
      <Typography fontWeight={600} variant="h4" mb={2}>
        Introduction
      </Typography>
      <Typography color="textSecondary" variant="subtitle2" mb={2}>
        Hello, I am {userData.profileName}. {userData.role}{userData.subRole}
      </Typography>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconBriefcase size="21" />
        {userData.role !== "Client" && (
          <Typography variant="h6" fontWeight={400}>
            {userData.role === "team" ? userData.subRole : userData.role}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">{userData.email}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconDeviceDesktop size="21" />
        <Typography variant="h6">{userData.phone}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={1}>
        <IconMapPin size="21" />
        <Typography variant="h6">{userData.address}</Typography>
      </Stack>
    </ChildCard>
  );
};

export default IntroCard;
