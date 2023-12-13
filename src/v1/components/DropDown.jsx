import React, { useState, useEffect } from 'react';
import { Link } from './Link';
import './DropDown.module.scss';

export const DropDown = (props) => {
  const {
    alignRight,
    label,
    options,
    disabled,
    hideIcon,
    id, // Unique id for drop down
    toggleDropDown, // To enable toggle callback function
    isActive = false // It is show or hide
  } = props;
  const [active, setActive] = useState(isActive);
  // Show and hide drop down onClick
  const handleOnClick = (event) => {
    event.preventDefault();
    if (disabled) return;
    if (toggleDropDown && id) toggleDropDown(isActive ? '' : id);
    setActive(!active);
  };
  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const iconClass = hideIcon ? '' : 'icon icon-chevron-down-dark';

  return (
    <div className='dropdown-wrapper' role='button' tabIndex='0'>
      <Link
        href='#'
        classNameProp={`${iconClass} ${disabled ? 'disabled' : ''} label ${active ? 'active' : ''}`}
        title={disabled ? 'Select more than one file' : ''}
        onClick={handleOnClick}
      >
        {label}
      </Link>
      <ul className={alignRight ? 'dropdown alignright' : 'dropdown'}>
        {options.map((option) => {
          return (
            <li className={`dropdown-item ${option.className || ''}`} key={option.label}>
              <Link
                href={option.to}
                query={option.id ? { id: option.id } : null}
                target={option.target || null}
                onClick={(e) => {
                  e.preventDefault();
                  handleOnClick(e);
                  if (typeof option.onClick === 'function') {
                    option.onClick();
                  }
                }}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
