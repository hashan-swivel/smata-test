import ExpandIcon from '@/@core/icons/ExpandIcon';
import GridIcon from '@/@core/icons/GridIcon';
import ListIcon from '@/@core/icons/ListIcon';
import SearchIcon from '@/@core/icons/SearchIcon';
import { DatatableViewOptions } from '@/types';
import {
  Box,
  Divider,
  InputAdornment,
  TextField,
  TextFieldProps,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';
import { RowSelectionState, Table } from '@tanstack/react-table';
import React, { useEffect } from 'react';

export type BulkActionsProps = (
  selection: RowSelectionState,
  selectionSize: number
) => React.ReactNode;

export type TableHeaderProps<TData> = {
  table: Table<TData>;
  selection: RowSelectionState;
} & Partial<{
  serachPlaceholder: string;
  /**
   * @description data description.
   */
  dataDesc: string;
  /**
   * Appears on table header
   */
  tableName: string;
  actions: React.ReactNode;
  onSearch: TextFieldProps['onChange'];
  activeView?: DatatableViewOptions;
  onChangeView?: (view: DatatableViewOptions) => void;
  expandable?: boolean;
  /**
   *
   * @param selection current table selection
   * @param selectionSize selection Size
   */
  BulkActions: BulkActionsProps;
}>;

export function TableHeader<TData>({
  table,
  selection,
  serachPlaceholder = 'Search',
  dataDesc = 'rows',
  tableName = '',
  actions,
  activeView,
  expandable,
  onChangeView,
  onSearch,
  BulkActions
}: TableHeaderProps<TData>) {
  const [currentView, setCurrentView] = React.useState<DatatableViewOptions>('list');

  const handleViewChange = (ev: unknown, value: DatatableViewOptions) => {
    setCurrentView(value);
    onChangeView && onChangeView(value);
  };

  useEffect(() => {
    if (activeView) {
      setCurrentView(activeView);
    }
  }, [activeView]);

  const selectionLength = Object.keys(selection).length;
  if (selectionLength > 0)
    return (
      <Box
        height='56px'
        sx={{
          backgroundColor: (theme) => theme.palette.grey['900'],
          padding: '12px',
          color: 'white',
          borderRadius: '2px'
        }}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        width={'100%'}
        marginBottom={2}
      >
        <Typography color='white'>{`${selectionLength} ${dataDesc} selected`}</Typography>
        <Box display='flex' gap={1.5}>
          {BulkActions && BulkActions(selection, selectionLength)}
        </Box>
      </Box>
    );
  else
    return (
      <Box
        display='flex'
        justifyContent='space-between'
        width='100%'
        height='56px'
        marginBottom={2}
      >
        <Typography variant='h1'>{tableName}</Typography>

        <TextField
          variant='filled'
          onChange={onSearch}
          placeholder={serachPlaceholder}
          sx={{ width: 376 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start' sx={{ color: (theme) => theme.palette.grey[500] }}>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <Box display='flex' gap={3.5} alignItems='center'>
          <Box display='flex' gap={1} alignItems='center' height={16}>
            {expandable && currentView && currentView == 'list' && (
              <Tooltip title='Expand rows items'>
                <ToggleButton
                  value={'expanded'}
                  selected={Boolean(table.getIsAllRowsExpanded())}
                  onChange={() => table.toggleAllRowsExpanded()}
                >
                  <ExpandIcon />
                </ToggleButton>
              </Tooltip>
            )}

            {activeView && (
              <>
                {currentView && currentView == 'list' && (
                  <Divider orientation='vertical' variant='middle' />
                )}
                <ToggleButtonGroup
                  aria-label='view'
                  exclusive
                  value={currentView}
                  onChange={handleViewChange}
                  sx={{
                    '& .MuiToggleButtonGroup-grouped': {
                      margin: 0,
                      border: 0,
                      padding: 1,
                      borderRadius: 0,
                      '&.Mui-disabled': {
                        border: 0
                      },
                      ':hover, &.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.action.hover
                      }
                    }
                  }}
                >
                  <ToggleButton value='list'>
                    <ListIcon />
                  </ToggleButton>
                  <ToggleButton value='grid'>
                    <GridIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            )}
          </Box>
          <div>{actions}</div>
        </Box>
      </Box>
    );
}
