import React from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from '@mui/material';

import { CrossIcon } from '@/@core/icons';

export interface ModalAction {
  label: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'text' | 'contained' | 'outlined';
}
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  footerAction: ModalAction;
  headerAction?: ModalAction;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Added size prop
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  content,
  headerAction,
  footerAction,
  size = 'sm'
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={size}
      aria-labelledby={`dialog-${title}`}
      aria-describedby={`dialog-describe-${title}`}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>{title}</Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {headerAction && (
            <Button
              size={'small'}
              onClick={headerAction.onClick}
              variant={headerAction.variant ?? 'contained'}
              color={headerAction.color ?? 'primary'}
            >
              {headerAction.label}
            </Button>
          )}
          <Box sx={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
            <CrossIcon data-testid='modal-close' onClick={onClose} />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <Divider />
      <DialogActions>
        <Button
          size={'small'}
          onClick={footerAction.onClick}
          variant={footerAction.variant ?? 'contained'}
          color={footerAction.color ?? 'primary'}
        >
          {footerAction.label}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
