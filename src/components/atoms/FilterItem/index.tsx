import {
  Box,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  Tooltip,
  TooltipProps,
  Typography
} from '@mui/material';
import React, { ReactNode, cloneElement, useState } from 'react';

type FilterItemPropsBase = {
  children?: ReactNode;
  Icon?: JSX.Element;
  filterName?: string;
} & CheckboxProps &
  Partial<Pick<TooltipProps, 'title' | 'placement'>>;

type FilterItemProps =
  | ({ children: ReactNode } & FilterItemPropsBase)
  | ({ Icon: JSX.Element; filterName: string } & FilterItemPropsBase);

/**
 * FilterItem component represents a filter element with optional icon, filter name, and children.
 *
 * @component
 * @example
 * // Example 1: Children provided, Icon and filterName are optional
 * <FilterItem>
 *   <div>Content goes here</div>
 * </FilterItem>;
 *
 * // Example 2: Icon and filterName provided, children is optional
 * <FilterItem Icon={<Icon>🔍</Icon>} filterName="Search Filter" />;
 *
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the FilterItem.
 * @param {React.ReactNode} [props.Icon] - The icon element to be displayed.
 * @param {string} [props.filterName] - The name of the filter.
 *
 * @returns {React.ReactNode} - The rendered FilterItem component.
 */
export const FilterItem: React.FC<FilterItemProps> = ({
  children,
  Icon,
  filterName,
  title = '',
  placement,
  ...checkboxProps
}: FilterItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Tooltip title={title} placement={placement}>
      <FormControlLabel
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          ':hover': {
            backgroundColor: 'rgba(2, 108, 143, 0.12)'
          },
          display: 'flex',
          width: '100%',
          height: 36,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 2,
          paddingY: '6px',
          margin: 0
        }}
        labelPlacement='start'
        label={
          children || (
            <Box display='flex' gap={1} alignItems='center'>
              {Icon && cloneElement(Icon, { width: 16, height: 16 })}
              <Typography component='span' variant='body2'>
                {filterName}
              </Typography>
            </Box>
          )
        }
        control={
          <Checkbox
            sx={{
              padding: 0.5,
              visibility: isHovered || checkboxProps.checked ? 'visible' : 'hidden'
            }}
            {...checkboxProps}
          />
        }
      ></FormControlLabel>
    </Tooltip>
  );
};
