import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Login = () => (
  <div className='navbar-menu-item'>
    <Link href='/' classNameProp='navbar-menu-item-link' target='_self'>
      <Tooltip arrow title='Login' position='bottom' animation='fade' theme='light'>
        <span className='icon icon-user-white nav-icon' />
      </Tooltip>
      <span className='icon-text'>Login</span>
    </Link>
  </div>
);

export default Login;
