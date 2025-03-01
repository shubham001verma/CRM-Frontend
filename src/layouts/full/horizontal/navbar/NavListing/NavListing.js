import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // ✅ Fixed Import
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavItem from '../NavItem/NavItem';
import NavCollapse from '../NavCollapse/NavCollapse';
import API_BASE_URL from '../../../../../components/Config';
import links from '../Menudata';
import { uniqueId } from 'lodash';
import { IconCalendarCheck,IconFileText } from "@tabler/icons-react";
const NavListing = () => {
  const { pathname } = useLocation();
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : false;

  const [userData, setUserData] = useState({ role: '', permissions: [] });

  const userId = sessionStorage.getItem('useridsrmapp');
  const teamId = sessionStorage.getItem('loggedInUserId');

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
  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      const [userResponse, clientResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/user/singleuser/${userId}`).catch(() => null),
        axios.get(`${API_BASE_URL}/client/singleclient/${userId}`).catch(() => null),
      ]);

      if (userResponse?.data || clientResponse?.data?.client) {
        setUserData({
          role: userResponse?.data?.role || clientResponse?.data?.client?.role || '',
          permissions: userResponse?.data?.permissions || [],
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [userId]);

  const fetchTeamData = useCallback(async () => {
    if (!teamId) return;

    try {
      const teamResponse = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
      if (teamResponse?.data?.teamMember) {
        setUserData({
          role: teamResponse.data.teamMember.role || '',
          permissions: teamResponse.data.teamMember.subrole?.permissions?.map((perm) => perm.module) || [],
        });
      }
    } catch (error) {
      console.error('Error fetching team member data:', error);
    }
  }, [teamId]);

  useEffect(() => {
    fetchUserData();
    fetchTeamData();
  }, [fetchUserData, fetchTeamData]);

  const filteredLinks = (() => {
    switch (userData.role) {
      case 'Admin':
        return links.Admin || [];
      case 'Client':
        return links.Client || [];
      case 'Team':
        return getTeamLinks(userData);
      default:
        return [];
    }
  })();

  return (
    <Box>
      <List sx={{ p: 0, display: 'flex', gap: '3px', zIndex: 100 }}>
        {filteredLinks.map((item) =>
          item.children ? (
            <NavCollapse
              key={item.id}
              menu={item}
              pathDirect={pathname}
              hideMenu={hideMenu}
            />
          ) : (
            <NavItem key={item.id} item={item} pathDirect={pathname} />
          )
        )}
      </List>
    </Box>
  );
};

export default NavListing;
