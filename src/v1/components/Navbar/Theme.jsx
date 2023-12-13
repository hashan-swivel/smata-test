import React from 'react';
import queryString from 'query-string';
import { useSelector } from 'react-redux';

export const Theme = ({ location, overrideTheme }) => {
  const query = queryString.parse(location?.search);
  const currentUser = useSelector((state) => state.auth.currentUser);
  let theme;

  if (overrideTheme) {
    theme = overrideTheme;
  } else if (query.primary_color && query.secondary_color) {
    theme = {
      primary_color: `#${query.primary_color}`,
      secondary_color: `#${query.secondary_color}`
    };
  } else {
    theme = { ...currentUser.theme };
  }

  return (
    <style jsx global>{`
      header,
      footer,
      nav,
      nav .navbar-menu-items,
      .notification-dropdown-container .notification-dropdown-list,
      .building-inspection-session-dropdown-container .building-inspection-session-dropdown-list,
      .navbar-options-dropdown,
      .locations-dropdown-button,
      .services-dropdown-button {
        background: ${theme.primary_color} !important;
      }

      .locations-dropdown-button:hover,
      .services-dropdown-button:hover {
        background: ${theme.primary_color} !important;
      }

      .dropdown-header .dropdown-header-title:after {
        background: ${theme.secondary_color} !important;
      }

      nav .icon::before,
      .header-navigation .icon::before,
      .hamburger-menu div,
      .hamburger-menu div:before,
      .hamburger-menu div:after {
        background-color: ${theme.secondary_color} !important;
      }

      nav .icon-text,
      footer span.footer-sitemap-legal,
      .notification-dropdown-list-item,
      .building-inspection-dropdown-list-item,
      .navbar-options-dropdown a,
      .header-navbar .flex-container .header-navlinks a,
      .locations-dropdown-button,
      .services-dropdown-button {
        color: ${theme.secondary_color} !important;
      }

      .locations-dropdown-button,
      .services-dropdown-button {
        border: 1px solid ${theme.secondary_color} !important;
      }

      .social-links-nav svg path {
        fill: ${theme.secondary_color} !important;
      }

      .auth-form .auth-form__logo-container {
        background-color: ${theme.primary_color} !important;
      }
    `}</style>
  );
};

Theme.defaultProps = {
  overrideTheme: null,
  location: null
};
