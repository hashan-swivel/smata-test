import React, { useState } from 'react';

import { AppBar, Box, Toolbar } from '@mui/material';

import { AvatarButton } from '@/components/atoms';
import { MenuPopOver } from '@/components/molecules';
import { ArrowUpRightIcon, LogoutIcon, SettingsIcon } from '@/core/icons';
import { MenuListItem } from '@/types/nav-bar';

import { AppBarActionButton } from '../AppBarActionButton';

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems: Array<MenuListItem> = [
    { label: 'Profile', icon: <ArrowUpRightIcon />, action: () => handleClose() },
    { label: 'Settings', icon: <SettingsIcon />, action: () => handleClose() },
    { label: 'Logout', icon: <LogoutIcon />, action: () => handleClose() }
  ];

  return (
    <AppBar
      aria-label='Navbar'
      position='static'
      sx={{
        backgroundColor: (theme) => theme.palette.grey[50],
        borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
        zIndex: 100
      }}
      elevation={0}
    >
      <Toolbar>
        {/* Find the proper logic to render this button */}
        {/* <Button size='small' startIcon={<ArrowLeftIcon />}>
          Back to all documents
        </Button> */}
        <Box flexGrow={1} />
        <AppBarActionButton />
        <AvatarButton onClick={handleClick} src='https://i.pravatar.cc/150?img=12' sx={{ ml: 5 }} />
        <MenuPopOver
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          menuItems={menuItems}
          onClick={handleClose}
          sx={{ zIndex: 99 }}
        />
      </Toolbar>
    </AppBar>
  );
};
