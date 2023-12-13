import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Theme } from './Theme';
import { Logo } from '../Logo';
import { Notifications } from '../Notifications';
import { logoutUser } from '../../../actions/auth';
import { LocationDropdown } from './LocationDropdown';
import { ServiceDropdown } from './ServiceDropdown';
import OrganisationDropdown from './OrganisationDropdown';
import InspectionSessions from '../BuildingInspectionSession/InspectionSessions';
import {
  Buildings,
  Contractors,
  CurrentAccount,
  Dashboard,
  Documents,
  Help,
  Jobs,
  Login,
  Messages,
  Reports,
  Schedules,
  StrataIntegration,
  TimeLogs,
  Users,
  Zoom,
  StrataMasterDataLogs
} from './Items';

import './Navbar.module.scss';

const Navbar = (props) => {
  const dispatch = useDispatch();
  const unreadMessages = useSelector((state) => state.notifications?.unreadMessages);
  const handleLogout = (event) => {
    if (event) event.preventDefault();
    dispatch(logoutUser());
  };

  const { user, isBuildingProfile, isConnectionPage, currentBuilding } = props;

  if (isConnectionPage) {
    const compareConnectTheme = { primary_color: '#FFFFFF', secondary_color: '#000000' };

    return (
      <>
        <nav className='nav'>
          <div className='nav-left'>
            <Logo light user image='/compare_connect_logo.png' href='#' />
          </div>
          <input type='checkbox' id='hamburger_menu_toggler' />
          <div className='hamburger-menu-container'>
            <div className='hamburger-menu'>
              <div />
            </div>
          </div>
          <div className='navbar-menu'>
            <div className='navbar-menu-items'>
              <StrataIntegration user={user} />
              <Users user={user} />
              <Jobs user={user} />
              <Contractors user={user} />
              <Schedules user={user} />
              <Reports user={user} />
              <Documents user={user} />
              <Buildings user={user} />
              <Dashboard user={user} />
              <TimeLogs user={user} />
              <Zoom user={user} />
              <Help />
              <Messages unreadMessages={unreadMessages} user={user} />
              <Notifications user={user} />
              <CurrentAccount handleLogout={handleLogout} user={user} />
            </div>
          </div>
        </nav>
        <Theme overrideTheme={compareConnectTheme} />
      </>
    );
  }

  return (
    <>
      {user.id ? (
        <>
          <nav className='nav'>
            <div className='nav-left'>
              {user?.isBuildingInspector ? (
                <InspectionSessions />
              ) : (
                <div className='logo-and-organisation-dropdown'>
                  <Logo light user image={user.theme ? user.theme.logo : ''} />
                  {user?.show_organisation_dropdown && <OrganisationDropdown user={user} />}
                </div>
              )}
              <div className='locations-and-services-dropdown'>
                {isBuildingProfile && !user?.isBuildingInspector && (
                  <LocationDropdown dispatch={dispatch} />
                )}
                {isBuildingProfile && !user?.isBuildingInspector && currentBuilding && (
                  <ServiceDropdown user={user} currentBuilding={currentBuilding} />
                )}
              </div>
            </div>
            <input type='checkbox' id='hamburger_menu_toggler' />
            <div className='hamburger-menu-container'>
              <div className='hamburger-menu'>
                <div />
              </div>
            </div>
            <div className='navbar-menu'>
              <div className='navbar-menu-items'>
                <StrataIntegration user={user} />
                <Users user={user} />
                <Jobs user={user} />
                <Contractors user={user} />
                <Schedules user={user} />
                <Reports user={user} />
                <StrataMasterDataLogs user={user} />
                <Documents user={user} />
                <Buildings user={user} />
                <Dashboard user={user} />
                <TimeLogs user={user} />
                <Zoom user={user} />
                <Help />
                <Messages unreadMessages={unreadMessages} user={user} />
                <Notifications user={user} />
                <CurrentAccount handleLogout={handleLogout} user={user} />
              </div>
            </div>
          </nav>
        </>
      ) : (
        <nav>
          <div className='nav-left'>
            <Logo light user image={user.theme ? user.theme.logo : ''} />
          </div>
          <div className='navbar-menu navbar-menu-logout'>
            <div className='navbar-menu-items'>
              <Help />
              <Login />
            </div>
          </div>
        </nav>
      )}
      {user.theme && <Theme />}
    </>
  );
};

export default Navbar;
