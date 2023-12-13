import React from 'react';

import { render, screen } from '@testing-library/react';

import { MenuPopOver } from '@/components/molecules';
import { ArrowUpRightIcon } from '@/core/icons';

import '@testing-library/jest-dom';

describe('MenuPopOver Component', () => {
  const mockOnClose = jest.fn();
  const mockOnClick = jest.fn();
  const sxMock = {};

  const menuItems = [
    { label: 'Item 1', icon: <ArrowUpRightIcon />, action: mockOnClick },
    { label: 'Item 2', icon: <ArrowUpRightIcon />, action: mockOnClick }
  ];

  const mockAnchorEl = document.createElement('div');

  it('renders correctly with all props', () => {
    render(
      <MenuPopOver
        anchorEl={mockAnchorEl}
        open={true}
        onClose={mockOnClose}
        menuItems={menuItems}
        onClick={mockOnClick}
        sx={sxMock}
      />
    );

    expect(screen.getByTestId('custom-menu')).toBeInTheDocument();
  });
});
