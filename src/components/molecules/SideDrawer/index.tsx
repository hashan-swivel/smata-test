import { CrossIcon } from '@/@core/icons';
import { Box, Drawer, DrawerProps, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type SideDrawerProps = DrawerProps & {
  /**
   * Component to show from the left side of drawer's close button
   */
  extra?: ReactNode;
  onClose?: () => void;
};

export const SideDrawer = ({
  open,
  title,
  children,
  extra,
  ModalProps,
  onClose,
  ...otherProps
}: SideDrawerProps) => {
  return (
    <Drawer
      variant='temporary'
      anchor='right'
      open={open}
      ModalProps={{ sx: { zIndex: 1201 }, ...ModalProps }}
      {...otherProps}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' py={2} pl={4} pr={3}>
        <Typography fontSize={18} fontWeight={600}>
          {title}
        </Typography>
        <Box>
          {extra}
          <IconButton aria-label='close' size='small' onClick={onClose}>
            <CrossIcon />
          </IconButton>
        </Box>
      </Box>

      <Box>{children}</Box>
    </Drawer>
  );
};
