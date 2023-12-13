import { SideDrawer } from '@/components/molecules';
import { Button } from '@mui/material';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('SideDrawer', () => {
  let titleText: HTMLElement,
    drawerContent: HTMLElement,
    closeButton: HTMLElement,
    extraButton: HTMLElement;

  const onCloseMock = jest.fn();
  const title = 'Test title';
  const content = 'Drawer content';
  const extra = <Button>Extra Button</Button>;

  beforeEach(() => {
    render(
      <SideDrawer open={true} title={title} extra={extra} onClose={onCloseMock}>
        {content}
      </SideDrawer>
    );

    titleText = screen.getByText(title);
    drawerContent = screen.getByText(content);
    closeButton = screen.getByRole('button', { name: 'close' });
    extraButton = screen.getByRole('button', { name: 'Extra Button' });
  });

  it('should render the drawer with correct components.', async () => {
    expect(titleText).toBeInTheDocument();
    expect(drawerContent).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(extraButton).toBeInTheDocument();
  });

  it('should call onClose function when click on close button.', () => {
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
