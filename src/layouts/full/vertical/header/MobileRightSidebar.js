import React, { useState,useEffect } from 'react';
import {
  IconApps,
  IconCalendarEvent,
  IconChevronDown,
  IconChevronUp,
  IconGridDots,
  IconMail,
  IconMessages,
} from '@tabler/icons';
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';

import { Link } from 'react-router';
import AppLinks from './AppLinks';
import QuickLinks from './QuickLinks';
import axios from 'axios'
import API_BASE_URL from "../../../../components/Config";
const MobileRightSidebar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
 const [roles, setRoles] = useState("");
  const userId= sessionStorage.getItem('useridsrmapp');
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (!userId) {
        console.error("User ID is missing or undefined");
        return;
    }

    const fetchPermission = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/client/singleclient/${userId}`);
            console.log("API Response:", response);
            setRoles(response.data.client.role);
        } catch (error) {
            console.error("Error fetching roles:", error.response ? error.response.data : error.message);
        }
    };

    fetchPermission();
}, [userId]);
  const cartContent = (
    <Box>
      {/* ------------------------------------------- */}
      {/* Apps Content */}
      {/* ------------------------------------------- */}
      <Box px={1}>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {/* <ListItemButton component={Link} to="/apps/chats">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconMessages size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Chats
              </Typography>
            </ListItemText>
          </ListItemButton> */}
            {roles !== "Client" && (
          <ListItemButton component={Link} to="/apps/calendar">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconCalendarEvent size="21" stroke="1.5" />
            </ListItemIcon>
          
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Calendar
              </Typography>
            </ListItemText>

          </ListItemButton>
            )}
          {/* <ListItemButton component={Link} to="/apps/email">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconMail size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Email
              </Typography>
            </ListItemText>
          </ListItemButton> */}
          {/* <ListItemButton onClick={handleClick}>
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconApps size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Apps
              </Typography>
            </ListItemText>
            {open ? (
              <IconChevronDown size="21" stroke="1.5" />
            ) : (
              <IconChevronUp size="21" stroke="1.5" />
            )}
          </ListItemButton> */}
          {/* <Collapse in={open} timeout="auto" unmountOnExit>
            <Box px={4} pt={3} overflow="hidden">
              <AppLinks />
            </Box>
          </Collapse> */}
        </List>
      </Box>

      {/* <Box px={3} mt={3}>
        <QuickLinks />
      </Box> */}
    </Box>
  );

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => setShowDrawer(true)}
        sx={{
          ...(showDrawer && {
            color: 'primary.main',
          }),
        }}
      >
        <IconGridDots size="21" stroke="1.5" />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Cart Sidebar */}
      {/* ------------------------------------------- */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{ sx: { width: '300px' } }}
      >
        <Box p={3} pb={0}>
          <Typography variant="h5" fontWeight={600}>
            Navigation
          </Typography>
        </Box>

        {/* component */}
        {cartContent}
      </Drawer>
    </Box>
  );
};

export default MobileRightSidebar;
