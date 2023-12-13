import { ChevronSolidLeftIcon, ChevronSolidRightIcon, QuestionOutlineIcon } from '@/@core/icons';
import { Logo, NavRailButton } from '@/components/atoms';
import { Navbar } from '@/components/molecules';
import { AddInvoice } from '@/components/templates';
import { navRailMenuItems } from '@/config/nav-rail-menu-items';
import { NAV_DRAWER_WIDTH, NAV_RAIL_WIDTH, TOP_NAV_HEIGHT } from '@/constants/layout';
import { Box, ButtonBase, Drawer, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
  filterComponent?: React.ReactNode;
};

type DrawerHandleProps = {
  open: boolean;
  onToggle: () => void;
  sx?: SxProps<Theme>;
};

const DrawerHandle = ({ open, onToggle, sx }: DrawerHandleProps) => {
  return (
    <ButtonBase
      aria-label='Drawer Handle'
      onClick={onToggle}
      sx={{
        ...sx,
        width: 18,
        height: 32,
        margin: 'auto',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        color: (theme) => theme.palette.common.white,
        background: (theme) => theme.palette.primary.main
      }}
    >
      {open ? <ChevronSolidLeftIcon /> : <ChevronSolidRightIcon />}
    </ButtonBase>
  );
};

export const MainLayout = ({ children, filterComponent }: MainLayoutProps) => {
  const theme = useTheme();
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'));

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box
      component='main'
      display='flex'
      position='relative'
      sx={{
        overflowX: 'hidden'
      }}
    >
      {/* Navigation Rail */}
      <Drawer
        variant='permanent'
        open={true}
        role='nav'
        aria-label='Navigation Rail'
        sx={{
          '& .MuiDrawer-paper': {
            zIndex: 1201,
            position: 'relative',
            overflow: !mdAndUp && !open ? 'visible' : 'hidden',
            width: NAV_RAIL_WIDTH,
            display: 'flex',
            height: '100vh',
            backgroundColor: (theme) => theme.palette.common.black
          }
        }}
      >
        <Box p={1} mb={1} height={72} width={72}>
          <Logo />
        </Box>

        {navRailMenuItems.map((menu) => (
          <NavRailButton key={menu.route} label={menu.label} icon={menu.icon} route={menu.route} />
        ))}

        <ButtonBase
          LinkComponent={Link}
          href='/help'
          aria-label='Help'
          sx={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            color: (theme) => theme.palette.lime['500']
          }}
        >
          <QuestionOutlineIcon width={24} height={24} />
        </ButtonBase>

        {!!filterComponent && !mdAndUp && (
          <DrawerHandle
            open={open}
            onToggle={toggleDrawer}
            sx={{
              right: -18,
              position: 'absolute',
              top: 0,
              bottom: 0,
              opacity: 0,
              visibility: 'hidden',
              ...(!open && {
                transition: theme.transitions.create('opacity', {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard
                }),
                opacity: 1,
                visibility: 'visible'
              })
            }}
          />
        )}
      </Drawer>

      {/* Navigation Drawer */}
      {!!filterComponent && (
        <Drawer
          aria-label='Filter Drawer'
          variant={mdAndUp ? 'permanent' : 'temporary'}
          open={mdAndUp ? true : open}
          sx={{
            '& .MuiDrawer-paper': {
              position: 'relative',
              left: mdAndUp ? 0 : NAV_RAIL_WIDTH,
              width: NAV_DRAWER_WIDTH,
              overflow: !mdAndUp && open ? 'visible' : 'hidden'
            }
          }}
        >
          <Box display='flex' width={NAV_DRAWER_WIDTH + 18} minHeight='100vh'>
            <Box width={NAV_DRAWER_WIDTH}>
              <Box position='relative'>{filterComponent}</Box>
            </Box>

            {!mdAndUp && <DrawerHandle open={open} onToggle={toggleDrawer} />}
          </Box>
        </Drawer>
      )}

      {/* Wrapper for Navbar and Main content */}
      <Box display='flex' flexGrow={1} flexDirection='column' position='relative'>
        <Navbar />

        {/* Main content */}
        <Box
          display='flex'
          flexDirection='column'
          sx={{
            overflow: 'auto',
            height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            width: `calc(100vw - ${mdAndUp ? NAV_DRAWER_WIDTH + NAV_RAIL_WIDTH : NAV_RAIL_WIDTH}px)`
          }}
        >
          {children}
        </Box>
      </Box>
      <AddInvoice />
    </Box>
  );
};
