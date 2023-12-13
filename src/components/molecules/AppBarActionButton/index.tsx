import React, { useState } from 'react';

import { alpha, Button, Divider } from '@mui/material';

import {
  AddIcon,
  ChevronSolidDownIcon,
  ChevronSolidUpIcon,
  DocumentIcon,
  InvoiceIcon,
  JobIcon,
  ReportIcon,
  TaskIcon,
  TimeIcon
} from '@/@core/icons';
import { MenuPopOver } from '@/components/molecules';
import useAppDispatch from '@/hooks/useAppDispatch';
import { showAddInvoiceModal } from '@/lib/features/modal/modalSlice';
import { MenuListItem } from '@/types/nav-bar';

export const AppBarActionButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (open) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleShowAddInvoice = () => {
    dispatch(showAddInvoiceModal());
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    // TODO:'Do the action here...'
    handleClose();
  };

  const menuItems: Array<MenuListItem> = [
    { label: 'Job request', icon: <JobIcon />, action: () => handleMenuItemClick() },
    { label: 'Invoice', icon: <InvoiceIcon />, action: () => handleShowAddInvoice() },
    { label: 'Document', icon: <DocumentIcon />, action: () => handleMenuItemClick() },
    { label: 'Report (PDF)', icon: <ReportIcon />, action: () => handleMenuItemClick() },
    { label: 'Task', icon: <TaskIcon />, action: () => handleMenuItemClick() },
    { label: 'Time log', icon: <TimeIcon />, action: () => handleMenuItemClick() }
  ];

  return (
    <div>
      <Button
        startIcon={<AddIcon />}
        endIcon={open ? <ChevronSolidUpIcon /> : <ChevronSolidDownIcon color='white' />}
        variant='contained'
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size='small'
      >
        New
        <Divider
          variant='middle'
          orientation='vertical'
          sx={{
            ml: 2,
            height: 16,
            borderColor: (theme) => alpha(theme.palette.common.white, 0.16)
          }}
        />
      </Button>
      <MenuPopOver
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        menuItems={menuItems}
        onClick={handleClose}
        sx={{ zIndex: 99 }}
      />
    </div>
  );
};
