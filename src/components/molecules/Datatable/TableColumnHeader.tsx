import { ArrowDownIcon, ArrowUpIcon } from '@/core/icons';
import { Box, ToggleButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

import { Column } from '@tanstack/react-table';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <ColumnHeader column={column} title={title} />;
  }
  return (
    <Box padding={0} margin={0} width={column.columnDef.minSize} display='flex' alignItems='center'>
      <Tooltip title={title}>
        <Typography noWrap component='span' variant='overline'>
          {title}
        </Typography>
      </Tooltip>
      <Tooltip title='Sort Newest/Oldest'>
        <ToggleButton
          value={'check'}
          selected
          size='small'
          onChange={() => column.toggleSorting(!(column.getIsSorted() === 'desc'))}
          sx={{
            padding: 0,
            border: 0,
            '&.Mui-selected': {
              backgroundColor: 'transparent',
              ':hover': {
                backgroundColor: (theme) => theme.palette.action.hover
              }
            }
          }}
        >
          {column.getIsSorted() === 'desc' ? <ArrowDownIcon /> : <ArrowUpIcon />}
        </ToggleButton>
      </Tooltip>
    </Box>
  );
}

export function ColumnHeader<TData, TValue>({
  column,
  title
}: {
  column: Column<TData, TValue>;
  title?: string;
}) {
  return (
    <Box padding={0} margin={0} width={column.columnDef.minSize} display='flex' alignItems='center'>
      <Tooltip title={title || (column.columnDef.header as string)}>
        <Typography noWrap component='span' variant='overline'>
          {title || (column.columnDef.header as string)}
        </Typography>
      </Tooltip>
    </Box>
  );
}
