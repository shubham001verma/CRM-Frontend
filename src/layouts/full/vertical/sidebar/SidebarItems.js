import React, { useEffect, useState, useCallback } from "react";
import { Box, List, useMediaQuery } from "@mui/material";
import { useLocation, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMobileSidebar } from "src/store/customizer/CustomizerSlice";
import axios from "axios";
import links from './MenuItems'
import { IconCalendarCheck,IconFileText } from "@tabler/icons-react";
import NavItem from "./NavItem";
import API_BASE_URL from "../../../../components/Config";
import { uniqueId } from 'lodash';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : false;

  const [userData, setUserData] = useState({ role: "", permissions: [] });

  const id = sessionStorage.getItem("useridsrmapp");
  const teamid = sessionStorage.getItem("loggedInUserId");

  const getTeamLinks = (userData) => {
    let filteredLinks = links.teamLinks.filter((link) => userData.permissions.includes(link.permission));
  
    filteredLinks.push({
      id: uniqueId(),
      title: "Leave",
      icon: IconCalendarCheck, 
      href: "/attandanceview",
    },
    {
      id: uniqueId(),
      title: "Daily Report",
      icon: IconFileText, // You can replace this with an appropriate icon
      href: "/managereportbyteam",
    });
  
    return filteredLinks;
  };
  


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
            role: userResponse.data.role || prev.role,
            image: userResponse.data.image ? `${API_BASE_URL}/${userResponse.data.image}` : prev.image,
          }));
        }

       

        if (clientResponse?.data?.client) {
          setUserData((prev) => ({
            ...prev,
            role: clientResponse.data.client.role || prev.role,
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
            role: teamResponse.data.teamMember.role || prev.role,
            subRole: teamResponse.data.teamMember.subrole?.name || prev.subRole, // Fixed casing
            permissions: teamResponse.data.teamMember.subrole?.permissions?.map((perm) => perm.module) || prev.permissions, // Correctly extracting modules
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

 
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
      {(userData && userData.role === "Admin"
    ? links.Admin
    : userData.role === "Client"
    ? links.Client
    : userData.role === "Team"
    ? getTeamLinks(userData) 
    : []
  ).map((item, index) => (
    <NavItem
    item={item}
    key={item.to}
    hideMenu={hideMenu}
    onClick={() => dispatch(toggleMobileSidebar())}
  />
        ))}
      </List>
    </Box>
  );
};

export default SidebarItems;
