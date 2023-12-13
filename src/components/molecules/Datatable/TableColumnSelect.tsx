import CustomizeColumnsIcon from '@/@core/icons/CustomizeColumnsIcon';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Table, VisibilityState } from '@tanstack/react-table';
import React from 'react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  uid: string;
}

const ITEM_HEIGHT = 64;

export function DataTableViewOptions<TData>({ table, uid }: DataTableViewOptionsProps<TData>) {
  const columnVisibility = table.getState().columnVisibility;

  function saveColumnVisibility() {
    localStorage.setItem(
      `visibleColumnIds-${uid}`,
      JSON.stringify([...Object.keys(columnVisibility).map((e) => e)])
    );
  }

  React.useEffect(() => {
    const defaultColVisibilty = table
      .getAllColumns()
      .filter((column) => !!!column.columnDef.meta?.hidden)
      .map((column) => column.id);

    if (localStorage.getItem(`visibleColumnIds-${uid}`) === null) {
      localStorage.setItem(`visibleColumnIds-${uid}`, JSON.stringify(defaultColVisibilty));
    }
    const allHideableColumnIds = table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => column.id);

    const initialColumnVisibility: VisibilityState = allHideableColumnIds.reduce(
      (visibilityState, columnId) => {
        visibilityState[columnId] = defaultColVisibilty.includes(columnId);
        return visibilityState;
      },
      {} as VisibilityState
    );

    table.setColumnVisibility(initialColumnVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        size='small'
        onClick={handleMenuOpen}
        sx={{ paddingBottom: 0, paddingLeft: '6px', paddingRight: '6px' }}
      >
        <CustomizeColumnsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: -36, horizontal: 'right' }}
        sx={{
          '.MuiMenu-paper': {
            width: '260px',
            maxHeight: ITEM_HEIGHT * 8,
            paddingBottom: 0
          },
          '& .MuiList-root': { paddingBottom: 0 },
          '& .MuiMenuItem-root': {
            width: 260
          }
        }}
      >
        {table
          .getAllColumns()
          .filter(
            (column) => typeof column.accessorFn !== 'undefined' && column.id !== 'rowactions'
          )
          .map((column) => (
            <MenuItem
              key={column.id}
              disabled={!column.getCanHide()}
              sx={{
                padding: '11px 28px'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={(event) => column.toggleVisibility(event.target.checked)}
                    style={{ padding: 2 }}
                  />
                }
                label={column.columnDef.meta?.selectLabel || column.id}
                style={{
                  textTransform: 'capitalize',
                  fontSize: '14px',
                  gap: 8
                }}
              />
            </MenuItem>
          ))}
        <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        <Box sx={{ gap: 2, padding: '12px 20px' }} display='flex'>
          <Button
            variant='contained'
            onClick={() => {
              saveColumnVisibility();
              handleMenuClose();
            }}
            size='small'
          >
            Save
          </Button>
          <Button variant='secondary' color='primary' onClick={handleMenuClose} size='small'>
            Cancel
          </Button>
        </Box>
      </Menu>
    </React.Fragment>
  );
}
