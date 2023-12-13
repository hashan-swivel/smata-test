import { NavDrawerSubSections } from '@/types';
import { Box, Typography } from '@mui/material';
import { FilterSubsection } from './FilterSubSection';

export function NavigationDrawer({
  sectionHeader,
  subSections,
  filters
}: {
  sectionHeader: string;
  subSections?: NavDrawerSubSections;
  filters?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '240px',
        height: '100vh',
        paddingBottom: '0px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexShrink: 0,
        bgcolor: 'rgba(2, 108, 143, 0.08)',
        borderRight: (theme) => `1px solid ${theme.palette.grey[200]}`
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '240px',
          height: '64px',
          padding: '8px 8px 8px 16px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '10px',
          flexShrink: 0
        }}
      >
        <Typography
          variant='h4'
          style={{
            color: 'var(--m-2-system-grey-grey-900, #191C1E)',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '24px'
          }}
        >
          {sectionHeader}
        </Typography>
      </Box>
      {subSections &&
        subSections.length > 0 &&
        subSections.map((props, idx) => <FilterSubsection {...props} key={`subsection-${idx}`} />)}
      {filters && (
        <Box
          component='ul'
          padding={0}
          margin={0}
          display='flex'
          sx={{
            width: `100%`,
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '14px'
            },
            '&::-webkit-scrollbar-track': {
              // border: '4px solid transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(25, 28, 30, 0.1)',
              border: '4px solid transparent',
              backgroundClip: 'padding-box'
            },
            '::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(25, 28, 30, 0.25)',
              border: '4px solid transparent',
              backgroundClip: 'padding-box'
            }
          }}
        >
          {filters}
        </Box>
      )}
    </Box>
  );
}
