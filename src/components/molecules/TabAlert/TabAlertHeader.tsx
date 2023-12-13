import React from 'react';
import {
  AlertTitle,
  Box,
  Button,
  SxProps,
  Theme,
  Typography,
  TypographyProps
} from '@mui/material';
import { sharedClasses } from '@/utils/shared-classes';
import { ArrowUpRightIcon } from '@/core/icons';

type Props = {
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
  titleVariant?: TypographyProps['variant'];
  sxTitle?: SxProps<Theme>;
  titleCornerBtnText?: string;
};
export const TabAlertHeader = ({
  title,
  titleIcon,
  titleVariant,
  sxTitle,
  titleCornerBtnText
}: Props) => {
  return (
    <>
      <AlertTitle sx={{ width: '100%' }}>
        <Box sx={{ ...sharedClasses.flexRowBetween }}>
          <Box sx={{ ...sharedClasses.flexAlignItemsCenter, gap: '12px' }}>
            {titleIcon}
            <Typography variant={titleVariant} sx={{ ...sxTitle }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </AlertTitle>
      <Box sx={{ position: 'absolute', top: 0, right: 0, margin: '12px' }}>
        {titleCornerBtnText && (
          <Typography>
            <Button
              endIcon={<ArrowUpRightIcon />}
              sx={{
                ...sharedClasses.flexAlignItemsCenter,
                padding: '0px 24px'
              }}
            >
              {titleCornerBtnText}
            </Button>
          </Typography>
        )}
      </Box>
    </>
  );
};
