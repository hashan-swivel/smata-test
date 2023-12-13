import React, { useState } from 'react';
import Cookie from 'js-cookie';
import { faDesktop, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Navbar from './Navbar/Navbar';
import './Header.module.scss';

export const Header = ({
  user,
  isBuildingProfile,
  isConnectionPage,
  currentBuilding,
  headerClassName
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { role } = user;
  const isCommittee = role === 'strata_member' || !role;
  const isUserMasquerade = Cookie.get('is_user_masquerade') === 'true';
  const headerClassNames = classNames(`${user ? 'user-wrapper' : 'wrapper'}`, headerClassName);
  const handleNavbar = () => setNavbarOpen(!navbarOpen);

  return (
    <header className='header'>
      <div className={headerClassNames}>
        <Navbar
          navbarState={navbarOpen}
          handleNavbar={handleNavbar}
          user={user}
          isCommittee={isCommittee}
          isBuildingProfile={isBuildingProfile}
          isConnectionPage={isConnectionPage}
          currentBuilding={currentBuilding}
        />
      </div>
      {isUserMasquerade && (
        <div id='masquerade_bar'>
          <div id='masquerade_bar_inner'>
            <FontAwesomeIcon icon={faDesktop} size='sm' />
            &nbsp;&nbsp;Support Panel
            <br />
            <a href={`${user?.baseUrl}/users/masquerade/back`}>
              <FontAwesomeIcon icon={faSignInAlt} size='sm' />
              &nbsp;&nbsp;Back to Smata Admin
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
