import React from 'react';
import { Alert, Button, SxProps, Theme, TypographyProps } from '@mui/material';
import { TabAlertHeader } from './TabAlertHeader';
import { TabAlertBody } from './TabAlertBody';

type Props = {
  sx?: SxProps<Theme>;
  titleVariant?: TypographyProps['variant'];
  messageVariant: TypographyProps['variant'];
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
  alertTitle?: React.ReactNode | string;
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
  sxTitle?: SxProps<Theme>;
  buttonTitle?: string;
  titleCornerBtnText?: string;
};
export const TabAlert = ({
  severity,
  message,
  titleVariant,
  messageVariant,
  sx,
  title,
  titleIcon,
  sxTitle,
  buttonTitle,
  titleCornerBtnText
}: Props) => {
  return (
    <Alert
      severity={severity}
      sx={{ ...sx, position: 'relative', maxWidth: '832px', width: '100%' }}
      icon={false}
    >
      {title && (
        <TabAlertHeader
          title={title}
          titleVariant={titleVariant}
          sxTitle={sxTitle}
          titleIcon={titleIcon}
          titleCornerBtnText={titleCornerBtnText}
        />
      )}
      {message && <TabAlertBody message={message} msgVariant={messageVariant} />}
      {buttonTitle && (
        <Button size='small' variant='contained' sx={{ marginTop: '12px' }}>
          {buttonTitle}
        </Button>
      )}
    </Alert>
  );
};
