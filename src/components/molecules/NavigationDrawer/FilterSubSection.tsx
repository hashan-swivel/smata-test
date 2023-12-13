import { AddIcon } from '@/@core/icons';
import theme from '@/core/theme';
import { SubSection } from '@/types';
import { Box, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function FilterSubsection({ name, path, action }: SubSection) {
  const pathname = usePathname();

  const active = useMemo(() => {
    return pathname === path || (pathname.includes(path) && path !== '/');
  }, [pathname, path]);

  return (
    <Link href={path}>
      <Box
        sx={{
          display: 'flex',
          width: '240px',
          height: '56px',
          padding: '18px 16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0,
          bgcolor: active ? theme.palette.branding['100'] : 'transparent',
          borderBottom: active ? `1px solid ${theme.palette.grey[900]}` : 'none',
          ':hover': {
            bgcolor: (theme) => theme.palette.action.hover
          }
        }}
      >
        <Typography variant='body1' component='div'>
          {name}
        </Typography>
        {action && (
          <IconButton size='small' sx={{ color: theme.palette.grey[900] }} onClick={action}>
            <AddIcon />
          </IconButton>
        )}
      </Box>
    </Link>
  );
}
