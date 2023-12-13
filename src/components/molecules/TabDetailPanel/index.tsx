import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

type Props = {
  title: string;
  description: string;
};

export const TabDetailPanel = ({ title, description }: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3} columns={16}>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={6}>
              <Typography
                variant='body1'
                sx={{
                  color: (theme) => theme.palette.grey['500']
                }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item xs={6}>
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
        </Grid>
      </Grid>
    </Box>
  );
};
