import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { TabComponents } from '@/components/organisms';

describe('TabComponents', () => {
  it('renders without crashing', () => {
    render(<TabComponents />);
    expect(screen.getByText('Share your experience with provider and other users!')).toBeTruthy();
  });

  it('switches tabs correctly', () => {
    render(<TabComponents />);

    // Assuming 'WorkRequest' and 'Details' are the texts on the tabs
    const workRequestTab = screen.getByText('WORK REQUEST');
    const detailsTab = screen.getByText('DETAILS');

    // Click on the 'Details' tab
    fireEvent.click(detailsTab);

    // Check if the content of the 'Details' tab is displayed
    expect(screen.getByText('Machinery Breakdown')).toBeInTheDocument();

    // Click on the 'WorkRequest' tab
    fireEvent.click(workRequestTab);

    // Check if the content of the 'WorkRequest' tab is displayed
    expect(
      screen.getByText('Share your experience with provider and other users!')
    ).toBeInTheDocument();
  });
});
