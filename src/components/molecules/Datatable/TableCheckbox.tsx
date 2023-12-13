import { Box } from '@mui/material';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import React, { forwardRef, useEffect } from 'react';

const TableCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef : any = ref || defaultRef;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate || false;
      }
    }, [resolvedRef, indeterminate]);
    return (
      <Box display='flex'>
        <Checkbox {...rest} inputRef={resolvedRef} onClick={(e) => e.stopPropagation()} />
      </Box>
    );
  }
);

TableCheckbox.displayName = 'TableCheckbox';

export default TableCheckbox;
