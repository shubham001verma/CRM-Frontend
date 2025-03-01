import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router'; // Using react-router
import { ListItemIcon, ListItem, List, styled, ListItemText, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const NavItem = ({ item, level, pathDirect, onClick }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();

  const itemIcon = <Icon stroke={1.5} size={level > 1 ? '1rem' : '1.1rem'} />;

  const ListItemStyled = styled(ListItem)(({ theme }) => ({
    padding: '8px 12px',
    gap: '10px',
    borderRadius: `${customizer.borderRadius}px`,
    marginBottom: level > 1 ? '3px' : '0px',
    color: theme.palette.text.secondary,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.primary.light + ' !important',
      color: theme.palette.primary.dark + ' !important',
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main + ' !important',
      color: 'white !important',
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={NavLink}
        to={item.href}
        className={({ isActive }) => (isActive ? 'active' : '')}
        onClick={onClick}
      >
        <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>{itemIcon}</ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  pathDirect: PropTypes.string,
  onClick: PropTypes.func,
};

export default NavItem;
