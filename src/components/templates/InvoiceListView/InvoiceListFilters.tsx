// import { AlertIcon16, StarIcon16 } from '@/@core/icons';
import { Box, FilledInput, InputAdornment, InputLabel, TextField } from '@mui/material';
import { FilterGroup, FilterItem } from '@/components/atoms';
import { CheckIcon, PersonaArrowLeftIcon, PersonaArrowRightIcon } from '@/core/icons';

// import { InvoiceListStatuses } from './statuses';

export function InvoiceListFilters() {
  return (
    <>
      <FilterGroup filterGroupName='Special Marker'>
        <FilterItem Icon={<CheckIcon />} filterName='For my approval' />
        <FilterItem Icon={<PersonaArrowLeftIcon />} filterName='Shared with me' />
        <FilterItem Icon={<PersonaArrowRightIcon />} filterName='For external approval' />
        {/* <FilterItem Icon={<AlertIcon16 />} filterName='Prioritised' />
        <FilterItem Icon={<StarIcon16 />} filterName='Favourites' /> */}
      </FilterGroup>
      {/* <FilterGroup filterGroupName='Status' collapsable>
        {Object.entries(InvoiceListStatuses).map(([k, v]) => (
          <FilterItem
            filterName='Favourites'
            key={`st-${k}`}
            title={v.description}
            placement='right'
          >
            <Status status={v.label} />
          </FilterItem>
        ))}
      </FilterGroup> */}
      {/* <FilterGroup filterGroupName='Plan number'>
        <Autocomplete
          disablePortal
          id='combo-box-demo'
          fullWidth
          sx={{ paddingX: 2 }}
          options={[
            { label: 'The Shawshank Redemption', year: 1994 },
            { label: 'The Godfather', year: 1972 },
            { label: 'The Godfather: Part II', year: 1974 },
            { label: 'The Dark Knight', year: 2008 },
            { label: '12 Angry Men', year: 1957 }
          ]}
          renderInput={(params) => (
            <TextField
              placeholder='Search By number'
              variant='filled'
              {...params}
              label='Movie'
              sx={{
                '& .MuiInputLabel-root': {
                  display: 'none'
                }
              }}
            />
          )}
        /> 
      {/* </FilterGroup> */}
      <FilterGroup filterGroupName='Provider'>
        <TextField variant='filled' placeholder='Search By number' fullWidth sx={{ paddingX: 2 }} />
      </FilterGroup>
      <FilterGroup filterGroupName='Amount'>
        <Box display='flex' gap={2} paddingX={2}>
          <Box display='flex' flexDirection='column'>
            <InputLabel htmlFor='filled-adornment-amount'>From</InputLabel>
            <FilledInput
              id='filled-adornment-amount'
              startAdornment={<InputAdornment position='start'>$</InputAdornment>}
            />
          </Box>
          <Box display='flex' flexDirection='column'>
            <InputLabel htmlFor='filled-adornment-amount'>To</InputLabel>
            <FilledInput
              id='filled-adornment-amount'
              startAdornment={<InputAdornment position='start'>$</InputAdornment>}
            />
          </Box>
        </Box>
      </FilterGroup>
      <FilterGroup filterGroupName='Date'>
        <Box display='flex' paddingX={2}>
          <FilledInput
            id='filled-adornment-amount'
            startAdornment={<InputAdornment position='start'></InputAdornment>}
          />
        </Box>
      </FilterGroup>
    </>
  );
}
