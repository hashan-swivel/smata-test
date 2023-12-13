import {
  faBell,
  faIdCard,
  faKey,
  faUserLock,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '../Link';

import './Navigation.module.scss';

export const Navigation = (props) => {
  const { settingsComponent } = props;

  const navigationItems = [
    {
      key: 'profile',
      label: 'Your Profile',
      icon: faIdCard,
      default: true
    },
    {
      key: 'notifications',
      icon: faBell,
      label: 'Notification Settings'
    },
    {
      key: 'password',
      icon: faKey,
      label: 'Change Password'
    },
    {
      key: '2fa',
      icon: faShieldAlt,
      label: 'Two-Factor Authentication'
    },
    {
      key: 'privacy',
      icon: faUserLock,
      label: 'Privacy Settings'
    }
  ];

  return (
    <div className='navigation-container'>
      {navigationItems &&
        navigationItems.map((item) => (
          <Link
            href='/src/pages/v1/settings'
            query={item.default ? {} : { section: item.key }}
            classNameProp={`navigation-item${settingsComponent === item.key ? ' active' : ''}`}
            key={`nav-${item.key}`}
            title={item.label}
          >
            <FontAwesomeIcon icon={item.icon} />
            <div className='hidden-small-desktop'>
              &nbsp;&nbsp;
              {item.label}
            </div>
          </Link>
        ))}
    </div>
  );
};
