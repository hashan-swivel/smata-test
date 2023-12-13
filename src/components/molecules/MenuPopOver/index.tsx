import React from 'react';

import { Menu, SxProps, Theme } from '@mui/material';
import { PopoverProps } from '@mui/material/Popover';

import { MenuListItem } from '@/types/nav-bar';

import { MenuItems } from './MenuItem';

type Props = {
  anchorEl: PopoverProps['anchorEl'];
  open: boolean;
  onClose: () => void;
  menuItems: Array<MenuListItem>;
  onClick: () => void;
  sx: SxProps<Theme>;
};

export const MenuPopOver = ({ anchorEl, open, onClose, menuItems, sx }: Props) => {
  return (
    <div data-testid='custom-menu'>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={sx}
      >
        <MenuItems menuListItems={menuItems} />
      </Menu>
    </div>
  );
};
