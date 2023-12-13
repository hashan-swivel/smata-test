import { hexToRGBA } from '@/core/theme/utils/hex-to-rgba';
import { Box, Button, Typography } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import { CollapsableFilterGroup, CollapsableFilterGroupProps } from './CollapsableFilterGroup';

type FilterGroupProps = {
  filterGroupName: string;
  children: ReactNode;
  /**
   * Collapsable Filter Group. Default `maxVisibleItems` : 3
   */
  collapsable?: boolean;
  onClear?: MouseEventHandler<HTMLButtonElement>;
} & Pick<CollapsableFilterGroupProps, 'maxVisibleItems' | 'expanded'>;

export function FilterGroup({
  filterGroupName,
  collapsable,
  children,
  onClear,
  ...collapsableProps
}: FilterGroupProps) {
  return (
    <Box
      component='li'
      sx={{
        display: 'flex',
        width: 240,
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: (theme) => `1px solid ${hexToRGBA(theme.palette.grey[500], 0.4)}`
      }}
      paddingBottom={collapsable ? 1 : 2.5}
    >
      <Box
        paddingX={2}
        sx={{
          display: 'flex',
          width: '100%',
          height: 48,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0
        }}
      >
        <Typography
          variant='overline'
          style={{
            color: 'rgba(117, 119, 121, 1)'
          }}
        >
          {filterGroupName}
        </Typography>
        {onClear && (
          <Button
            variant='text'
            size='small'
            onClick={onClear}
            style={{
              padding: 0
            }}
          >
            Clear all
          </Button>
        )}
      </Box>
      {collapsable ? (
        <CollapsableFilterGroup {...collapsableProps}>{children}</CollapsableFilterGroup>
      ) : (
        (children as React.ReactElement)
      )}
    </Box>
  );
}
