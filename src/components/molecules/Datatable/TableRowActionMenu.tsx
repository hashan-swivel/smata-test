import MoreVertIcon from '@/@core/icons/MoreVertIcon';
import { RowActionMenuItem } from '@/types';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Row } from '@tanstack/react-table';
import React, { useState } from 'react';

export function TableRowActionMenu<TData>({
  row,
  menuItems
}: {
  row: Row<TData>;
  menuItems: Array<RowActionMenuItem>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    // row.toggleSelected(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // row.toggleSelected(true);
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <IconButton
        sx={{
          padding: '6px',
          visibility: row.getIsSelected() || anchorEl != null ? 'visible' : 'hidden'
        }}
        id='row-action-button'
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: -8, horizontal: 'right' }}
        sx={{ zIndex: 99 }}
      >
        {menuItems.map((menuItem) => (
          <MenuItem
            key={menuItem.label}
            onClick={() => {
              menuItem.onClick && menuItem.onClick();
              handleClose();
            }}
            sx={{
              minWidth: 252,
              alignItems: 'center',
              color: (theme) =>
                menuItem.color == 'error' ? theme.palette.error.dark : theme.palette.grey['900']
            }}
          >
            <ListItemIcon
              sx={{
                color: (theme) =>
                  menuItem.color == 'error' ? theme.palette.error.dark : theme.palette.grey['900']
              }}
            >
              {menuItem.icon}
            </ListItemIcon>
            <span color='inherit'>{menuItem.label}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
