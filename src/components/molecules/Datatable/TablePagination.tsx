import { TablePagination, Box } from '@mui/material';

import { Table } from '@tanstack/react-table';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    table.setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPageSize(parseInt(event.target.value, 10));
  };

  return (
    <Box display='flex' justifyContent='end' width={'100%'}>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        component='div'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showLastButton
        sx={{
          '& .MuiTablePagination-select': {
            width: '64px'
          },
          '& .MuiInputBase-input': {
            textAlign: 'left',
            textAlignLast: 'left'
          }
        }}
      />
    </Box>
  );
}
