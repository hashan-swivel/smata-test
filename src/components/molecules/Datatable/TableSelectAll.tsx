import React from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import ChevronSolidDownIcon from '@/core/icons/chevron-solid';
import theme from '@/core/theme';
import { Table } from '@tanstack/react-table';

import TableCheckbox from './TableCheckbox';

export type TableSelectAllCheckBoxProps<TData> = {
  table: Table<TData>;
  totalRecords: number;
};

export default function TableSelectAllCheckBox<TData>({
  table,
  totalRecords
}: TableSelectAllCheckBoxProps<TData>) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  //const startIndex = table.getState().pagination.pageIndex * table.getState().pagination.pageSize;
  // const endIndex = startIndex + table.getState().pagination.pageSize;
  const currentPageRecords = totalRecords;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAllPages = () => {
    table.toggleAllRowsSelected(false);
    table.toggleAllRowsSelected(!table.getIsAllRowsSelected());
    handleMenuClose();
  };

  const handleSelectCurrentPage = () => {
    if (table.getIsAllRowsSelected()) {
      table.toggleAllRowsSelected(false);
      table.toggleAllPageRowsSelected(true);
    } else table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected());
    handleMenuClose();
  };

  return (
    <Box display='flex'>
      <Button
        onClick={handleMenuOpen}
        endIcon={<ChevronSolidDownIcon />}
        size='small'
        variant='text'
        sx={{
          flexShrink: 0,
          padding: 0,
          margin: 0,
          minWidth: 48,
          justifyContent: 'start',
          ':hover': {
            backgroundColor: (theme) => theme.palette.action.hover
          },
          '& .MuiButton-endIcon': {
            marginLeft: 0
          }
        }}
      >
        <TableCheckbox
          style={{ padding: 0 }}
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onChange={(event) => {
            table.toggleAllPageRowsSelected(!!event.target.checked);
          }}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: -36, horizontal: 'left' }}
      >
        <MenuItem
          disabled
          style={{
            textTransform: 'uppercase',
            fontSize: 12,
            color: theme.palette.text.primary
          }}
        >
          select on
        </MenuItem>
        <MenuItem onClick={handleSelectCurrentPage}>
          {currentPageRecords && `Current Page (${currentPageRecords})`}
        </MenuItem>
        <MenuItem onClick={handleSelectAllPages}>
          {totalRecords && `All Pages (${totalRecords})`}
        </MenuItem>
      </Menu>
    </Box>
  );
}
