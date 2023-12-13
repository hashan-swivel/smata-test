import theme from '@/@core/theme';
import { MainLayout } from '@/components/layout';
import { renderWithProviders } from '@/utils/test-utils';
import { ThemeProvider } from '@mui/material';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';

describe('MainLayout', () => {
  let navRailDrawer: HTMLElement,
    logo: HTMLElement,
    navMenuItems: HTMLElement[],
    helpLink: HTMLElement,
    navbar: HTMLElement,
    newButton: HTMLElement,
    children: HTMLElement;

  beforeEach(() => {
    renderWithProviders(
      <ThemeProvider theme={theme}>
        <MainLayout>children</MainLayout>
      </ThemeProvider>
    );

    navRailDrawer = screen.getByRole('nav', { name: 'Navigation Rail' });
    logo = screen.getByRole('img', { name: 'Logo' });
    navMenuItems = screen.getAllByRole('link');
    helpLink = screen.getByRole('link', { name: 'Help' });
    navbar = screen.getByRole('banner', { name: 'Navbar' });
    newButton = screen.getByRole('button', { name: 'New' });
    children = screen.getByText('children');
  });

  it('should render children passed to the layout.', () => {
    expect(children).toBeInTheDocument();
  });

  it('should render Navigation Rail and its components.', () => {
    expect(navRailDrawer).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(navMenuItems.length).toBeGreaterThan(1);
    expect(helpLink).toBeInTheDocument();
  });

  it('should render Navbar and its components.', () => {
    expect(navbar).toBeInTheDocument();
    expect(newButton).toBeInTheDocument();
  });

  it('should not render Filter Drawer and Drawer Handle when filter component is not provided.', async () => {
    const filterDrawer = screen.queryByLabelText('Filter Drawer');
    const drawerHandle = screen.queryByRole('button', { name: 'Drawer Handle' });

    expect(filterDrawer).not.toBeInTheDocument();
    expect(drawerHandle).not.toBeInTheDocument();
  });

  it('should render Drawer Handle and Filter Drawer when filter component is provided.', async () => {
    renderWithProviders(
      <ThemeProvider theme={theme}>
        <MainLayout filterComponent={<div>Filters</div>}>children</MainLayout>
      </ThemeProvider>
    );

    const drawerHandle = screen.getByRole('button', { name: 'Drawer Handle' });

    expect(drawerHandle).toBeInTheDocument();

    // Open Filter Drawer by clicking on Drawer Handle
    fireEvent.click(drawerHandle);

    const filterDrawer = screen.getByLabelText('Filter Drawer');
    const filterContent = screen.getByText('Filters');

    expect(filterDrawer).toBeInTheDocument();
    expect(filterContent).toBeInTheDocument();
  });
});
