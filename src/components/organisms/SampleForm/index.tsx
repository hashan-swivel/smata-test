import { StyledInputLabel } from '@/components/atoms';
import { SampleFormSchema, SampleForm as SampleFormType } from '@/schema/sample-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export const SampleForm = () => {
  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    website: ''
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: zodResolver(SampleFormSchema)
  });

  const onSubmit: SubmitHandler<SampleFormType> = (data) => {
    console.log(data);
  };

  return (
    <Card>
      <CardContent>
        <Box
          component='form'
          display='flex'
          flexDirection='column'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <>
                    <StyledInputLabel htmlFor='name'>Name</StyledInputLabel>
                    <TextField
                      {...field}
                      id='name'
                      fullWidth
                      placeholder='Name'
                      variant='filled'
                      error={!!errors.name?.message}
                      helperText={errors.name?.message}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <>
                    <StyledInputLabel htmlFor='email'>Email</StyledInputLabel>
                    <TextField
                      {...field}
                      id='email'
                      fullWidth
                      placeholder='Email'
                      variant='filled'
                      error={!!errors.email?.message}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <>
                    <StyledInputLabel htmlFor='phone'>Phone</StyledInputLabel>
                    <TextField
                      {...field}
                      id='phone'
                      fullWidth
                      placeholder='Phone'
                      variant='filled'
                      error={!!errors.phone?.message}
                      helperText={errors.phone?.message}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <>
                    <StyledInputLabel id='gender'>Gender</StyledInputLabel>
                    <FormControl fullWidth variant='filled' sx={{ mb: 4 }}>
                      <Select {...field} labelId='gender' error={!!errors.gender?.message}>
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                      </Select>
                      <FormHelperText error={!!errors.gender?.message}>
                        {errors.gender?.message}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='website'
                control={control}
                render={({ field }) => (
                  <>
                    <StyledInputLabel htmlFor='website'>Website</StyledInputLabel>
                    <TextField
                      {...field}
                      id='website'
                      fullWidth
                      placeholder='Website'
                      variant='filled'
                      error={!!errors.website?.message}
                      helperText={errors.website?.message}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
              />
            </Grid>
          </Grid>
          <Button type='submit' size='small' variant='contained'>
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
