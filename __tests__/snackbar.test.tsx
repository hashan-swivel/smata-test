import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { Button } from '@mui/material';

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue
    };
  }
}));

it('should render the default snackbar in the React DOM', async () => {
  render(<SnackbarProvider maxSnack={3} />);
  mockEnqueue('this is a test message to check the default snackbar', {
    preventDuplicate: false
  });
  waitFor(() => {
    expect(
      screen.queryByText(/this is a test message to check the default snackbar/)
    ).toBeInTheDocument();
  });
});

it('should render the callback snackbar in the React DOM', async () => {
  render(<SnackbarProvider maxSnack={3} />);
  mockEnqueue('this is a test message to check the callback snackbar', {
    preventDuplicate: false,
    action: () => <Button variant='text'>Undo</Button>
  });
  waitFor(() => {
    expect(
      screen.queryByText(/this is a test message to check the callback snackbar/)
    ).toBeInTheDocument();
  });
});
