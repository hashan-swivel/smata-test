import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Modal } from '@/components/molecules';

describe('Modal', () => {
  const onCloseMock = jest.fn();
  const footerActionMock = {
    label: 'Submit',
    onClick: jest.fn()
  };

  const headerActionMock = {
    label: 'Add New Item',
    onClick: jest.fn()
  };

  const renderModal = () => {
    const defaultProps = {
      open: true,
      onClose: onCloseMock,
      title: 'Test Modal',
      content: <>Test Content</>,
      footerAction: footerActionMock
    };

    return render(<Modal {...defaultProps} />);
  };

  const renderModalWithHeader = () => {
    const defaultProps = {
      open: true,
      onClose: onCloseMock,
      title: 'Test Modal',
      content: <>Test Content</>,
      footerAction: footerActionMock,
      headerAction: headerActionMock
    };

    return render(<Modal {...defaultProps} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Modal with correct title and content', () => {
    renderModal();

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the Modal with correct title , content and with header action button ', () => {
    renderModalWithHeader();

    expect(screen.getByText('Test Modal')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
    expect(screen.getByText('Add New Item')).toBeDefined();
  });

  it('calls onClose when the close button is clicked', () => {
    renderModal();

    fireEvent.click(screen.getByTestId('modal-close'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls footerAction.onClick when the footer button is clicked', () => {
    renderModal();

    fireEvent.click(screen.getByText('Submit'));

    expect(footerActionMock.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls header.onClick when the header button is clicked', () => {
    renderModalWithHeader();

    fireEvent.click(screen.getByText('Add New Item'));

    expect(headerActionMock.onClick).toHaveBeenCalledTimes(1);
  });
});
