import React from 'react';

import { Box, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material';

import { MenuListItem } from '@/types/nav-bar';

type MenuItemsProps = {
  menuListItems: Array<MenuListItem>;
};
export const MenuItems = ({ menuListItems }: MenuItemsProps) => {
  return (
    <Box sx={{ width: 240, maxWidth: '100%' }}>
      <MenuList>
        {menuListItems.map((item, index) => (
          <MenuItem key={index} onClick={item.action}>
            {item.icon && (
              <ListItemIcon sx={{ color: (theme) => theme.palette.grey['900'] }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText sx={{ color: (theme) => theme.palette.grey['900'] }}>
              {item.label}
            </ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Box>
  );
};
