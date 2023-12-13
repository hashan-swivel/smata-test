import React, { useMemo } from 'react';
import { Tooltip } from 'react-tippy';
import classNames from 'classnames';
import { calculateAvatarColor, userFullName } from '../../utils/userHelpers';
import '../../sass/modules/react-tippy.module.scss';
import './Avatar.module.scss';

export const Avatar = (props) => {
  const {
    image,
    firstName,
    lastName,
    fullName,
    userName,
    size,
    showName,
    defaultBg,
    showTooltip,
    tooltipText,
    remainder,
    currentlyWith,
    approverClass,
    approved,
    onHold,
    initials,
    state
  } = props;
  const sizeClass = size || 'medium';
  const inactive = state && state !== 'active';

  const name = fullName || userName || userFullName(firstName, lastName);
  const userInitials = `${firstName ? firstName.charAt(0) : ''}${
    lastName ? lastName.charAt(0) : ''
  }`;
  const backgroundImage = image && `url('${image}')`;
  let backgroundColor;
  if (backgroundImage) {
    backgroundColor = 'transparent';
  } else {
    backgroundColor = name
      ? calculateAvatarColor(`${firstName} ${lastName}`, defaultBg)
      : '#4FCBB2';
  }
  const borderColor =
    name && !image ? calculateAvatarColor(`${firstName} ${lastName}`, defaultBg) : null;
  const filter = `grayscale(${inactive ? 1 : 0})`;

  const tooltip = useMemo(() => {
    if (inactive) return `${name} - not active`;
    if (tooltipText) return tooltipText;
    if (currentlyWith) return `${name} – assigned`;
    return name;
  }, [tooltipText, name, currentlyWith]);

  if (!image && !name && !remainder) return null;

  const avatarClass = classNames('avatar-photo', sizeClass, approverClass, {
    'with-tooltip': showTooltip,
    'approver-green': approved,
    'approver-orange': onHold,
    'approver-assigned': currentlyWith
  });

  return (
    <div className='avatar'>
      <Tooltip
        arrow
        title={tooltip}
        animation='fade'
        theme='light'
        duration='200'
        position='bottom'
        disabled={!showTooltip}
        className={avatarClass}
        style={{ backgroundColor, borderColor, backgroundImage, filter }}
      >
        {!image && (
          <>
            {remainder && <span className='avatar-letter'>+ {remainder}</span>}
            {initials && <span className='avatar-letter'>{initials}</span>}
            {!initials && name && userInitials && (
              <span className='avatar-letter'>{userInitials}</span>
            )}
          </>
        )}
      </Tooltip>
      {showName && name ? <h4 className='name'>{name}</h4> : null}
    </div>
  );
};
