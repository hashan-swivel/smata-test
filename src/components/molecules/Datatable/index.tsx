import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  Row,
  RowPinningState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import * as React from 'react';

import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { DEFAULT_PAGE_SIZE } from '@/constants/table';
import TableCheckbox from './TableCheckbox';
import { ColumnHeader } from './TableColumnHeader';
import { DataTableViewOptions } from './TableColumnSelect';
import { TableHeader, TableHeaderProps } from './TableHeader';
import { TableLoading } from './TableLoading';
import { DataTablePagination } from './TablePagination';
import TableSelectAllCheckBox from './TableSelectAll';

type DataTableProps<TData, TValue> = {
  /**
   * Column Definitions
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Table Data
   */
  data: TData[];
  /**
   *  UniqueID denoting table. This will be used for saving column select state
   */
  uid: string;
  /**
   *  Required for Pagination
   */
  totalRecords?: number;
  onRowClick?: (row: Row<TData>) => void;
  /**
   *  get prioritised Row Key based on data property. If not provided prioritised rows will not be at the top & highlighted
   *  @returns boolean
   */
  getPrioritisedRowKey?: (row: TData) => boolean;
  /**
   *  Hide row select checkboxes
   */
  disableRowSelect?: boolean;
  /**
   *  Hide Column Customize - *Disabled in SMATA V2 Phase-1 developement*
   */
  disableCustomizeColumn?: boolean;
  isLoading?: boolean;
  isAllRowsExpanded?: boolean;
  getExpandedContent?: (row: Row<TData>) => [];
  expandedContent?: (rows: Row<TData>[]) => React.ReactNode;
  /**
   *  if `activeView = grid` render data grid
   */
  renderGrid?: (row: Row<TData>[]) => React.ReactNode;
} & Partial<TableHeaderProps<TData>>;

export function DataTable<TData, TValue>({
  uid,
  columns,
  data,
  totalRecords = data.length,
  disableRowSelect = false,
  disableCustomizeColumn = false,
  isLoading = false,
  isAllRowsExpanded,
  getExpandedContent,
  expandedContent,
  onRowClick,
  getPrioritisedRowKey: prioritisedRowKey,
  activeView = 'list',
  renderGrid,
  ...headerProps
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [expanded, setExpanded] = React.useState<ExpandedState>(isAllRowsExpanded || {});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const priotizedRows = React.useMemo<RowPinningState>(
    () => ({
      top: prioritisedRowKey
        ? (data
            .map((r, idx) => (prioritisedRowKey(r) ? idx.toString() : null))
            .filter((idx) => idx !== null) as string[])
        : []
    }),
    [data, prioritisedRowKey]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      rowPinning: priotizedRows
    },
    enableRowSelection: true,
    enableExpanding: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  return (
    <>
      <TableHeader
        table={table}
        selection={rowSelection}
        expandable={Boolean(expandedContent)}
        activeView={renderGrid ? activeView : undefined}
        {...headerProps}
      />
      {activeView == 'grid' && renderGrid && renderGrid(table.getRowModel().rows)}
      {activeView == 'list' && (
        <Paper sx={{ width: '100%', boxShadow: 'none', position: 'relative' }}>
          <Table>
            <TableHead
              sx={{
                position: 'sticky',
                height: 30
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {!disableRowSelect && (
                    <TableCell
                      style={{
                        padding: 2,
                        borderBottom: '1px solid #191C1E'
                      }}
                    >
                      <TableSelectAllCheckBox table={table} totalRecords={totalRecords} />
                    </TableCell>
                  )}
                  {headerGroup.headers
                    .filter((header) => !disableCustomizeColumn || header.id !== 'rowactions')
                    .map((header) => {
                      return (
                        <TableCell
                          key={header.id}
                          style={{
                            padding: 0,
                            borderBottom: '1px solid #191C1E',
                            minWidth: `${header.column.columnDef.minSize}px`
                          }}
                        >
                          {typeof header.column.columnDef.header == 'string' ? (
                            <ColumnHeader column={header.column} />
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  <TableCell
                    key={'col-select'}
                    width={disableCustomizeColumn ? 52 : 32}
                    style={{
                      padding: 0,
                      borderBottom: '1px solid #191C1E'
                    }}
                  >
                    {!disableCustomizeColumn && <DataTableViewOptions table={table} uid={uid} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {data && data.length ? (
                <>
                  {[...table.getTopRows(), ...table.getCenterRows()].map((row) => (
                    <>
                      <TableRow
                        key={row.id}
                        data-state={
                          (row.getIsSelected() || table.getIsAllPageRowsSelected()) && 'selected'
                        }
                        hover
                        selected={row.getIsSelected() || table.getIsAllPageRowsSelected()}
                        onClick={() => onRowClick && onRowClick(row)}
                        sx={{
                          ...(row.getIsPinned() === 'top' && {
                            backgroundColor: 'rgba(243, 59, 59, 0.12) !important'
                          }),
                          '&:hover': {
                            ...(row.getIsPinned() !== 'top' && {
                              backgroundColor: `rgba(2, 108, 143, 0.08) !important`
                            }),
                            ...(onRowClick && { cursor: 'pointer' })
                          },
                          '&:hover td': {
                            borderBottom: (theme) => `1px solid ${theme.palette.grey[900]}`
                          },
                          '&:hover td:first-child span': {
                            display: 'inline !important'
                          },
                          '&:hover td button[id="row-action-button"]': {
                            visibility: 'visible !important'
                          }
                        }}
                      >
                        {!disableRowSelect && (
                          <TableCell
                            padding='none'
                            sx={{
                              paddingLeft: 2,
                              height: '56px',
                              'span.Mui-checked': {
                                display: 'inline !important'
                              }
                            }}
                          >
                            {
                              <TableCheckbox
                                style={{
                                  padding: 0,
                                  display: 'none'
                                }}
                                checked={row.getIsSelected()}
                                onChange={(event) => row.toggleSelected(!!event.target.checked)}
                                aria-label='Select row'
                                className='translate-y-[2px]'
                              />
                            }
                          </TableCell>
                        )}
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            padding='none'
                            key={cell.id}
                            style={{
                              height: '56px'
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && getExpandedContent && getExpandedContent(row) ? (
                        <TableRow hover key={`${row.id}-expanded`}>
                          <TableCell />
                          <TableCell colSpan={columns.length - 1}>
                            {expandedContent && expandedContent(getExpandedContent(row))}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </>
                  ))}
                </>
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center' }}>
                      No results.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          {isLoading && <TableLoading />}
        </Paper>
      )}
      {data && data.length > 0 && <DataTablePagination table={table} />}
    </>
  );
}
