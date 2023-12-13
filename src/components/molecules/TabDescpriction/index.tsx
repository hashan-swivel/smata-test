import React from 'react';
import { Box, Button, Grid, SxProps, Theme, Typography } from '@mui/material';
import { ArrowUpRightIcon } from '@/core/icons';

type Props = {
  title: string;
  description: string;
  buttonTitle?: string;
  buttonText?: string;
  sx?: SxProps<Theme>;
};

export const TabDescription = ({ title, description, buttonTitle, buttonText, sx }: Props) => {
  return (
    <Box sx={{ flexGrow: 1, ...sx }}>
      <Grid container spacing={3} columns={16}>
        <Grid item xs={10}>
          <Grid container>
            <Typography
              variant='body1'
              sx={{
                color: (theme) => theme.palette.grey['500']
              }}
            >
              {title}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: (theme) => theme.palette.grey['900']
              }}
            >
              {description}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction='column'>
            <Grid item sx={{ mb: 0.5 }}>
              <Typography
                variant='body1'
                sx={{
                  color: (theme) => theme.palette.grey['500']
                }}
              >
                {buttonTitle}
              </Typography>
            </Grid>
            {buttonText && (
              <Grid item>
                <Button
                  variant='contained'
                  size='small'
                  endIcon={<ArrowUpRightIcon />}
                  sx={{
                    color: (theme) => theme.palette.grey['900'],
                    backgroundColor: (theme) => theme.palette.primary.light
                  }}
                >
                  {buttonText}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
