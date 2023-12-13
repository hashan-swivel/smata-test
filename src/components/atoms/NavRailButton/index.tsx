import { Box, ButtonBase } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

type NavRailButtonProps = {
  label: string;
  icon: ReactNode;
  route: string;
};

export const NavRailButton = ({ label, icon, route }: NavRailButtonProps) => {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return pathname === route || (pathname?.startsWith(route) && route !== '/');
  }, [pathname, route]);

  return (
    <ButtonBase
      LinkComponent={Link}
      href={route}
      className={isActive ? 'active' : ''}
      sx={{
        height: 72,
        width: 72,
        p: '14px 9px 16px 8px',
        color: (theme) => theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        '&:hover, &:active, &.active': {
          color: (theme) => theme.palette.lime['400'],
          '& .nav-rail-btn-icon': {
            color: (theme) => theme.palette.lime['400']
          }
        },
        '& .nav-rail-btn-icon': {
          color: (theme) => theme.palette.grey['500']
        }
      }}
    >
      <Box className='nav-rail-btn-icon'>{icon}</Box>
      <Box className='nav-rail-btn-label' mt={0.25} fontSize={12} lineHeight='16px'>
        {label}
      </Box>
    </ButtonBase>
  );
};
