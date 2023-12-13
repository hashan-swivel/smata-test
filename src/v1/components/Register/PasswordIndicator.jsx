import React from 'react';
import { userConstants } from '../../../constants';

import './PasswordIndicator.module.scss';

export const PasswordIndicator = (props) => {
  const { passwordError } = props;
  return (
    <div className={`password-error ${passwordError ? 'active' : 'inactive'}`}>
      Password Strength
      <ul>
        <li>
          <span className={`error-message ${passwordError ? 'active' : 'inactive'}`}>
            Must contain {userConstants.PASSWORD_MIN_LENGTH} or more characters.
          </span>
        </li>
        <li>
          <span className={`error-message ${passwordError ? 'active' : 'inactive'}`}>
            Must contain uppercase letters, lowercase letters and numbers.
          </span>
        </li>
      </ul>
    </div>
  );
};
