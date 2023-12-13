import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

//import './DropdownButton.module.scss';

export const DropdownButton = ({
  onClickHandler,
  disabled,
  text,
  className,
  dropdownClassName,
  children
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle clicking off the dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className: targetClassName } = target;

      if (
        typeof targetClassName === 'string' &&
        !targetClassName.includes(`invoice-action-dropdown`)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [showDropdown]);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(true);
  };

  return (
    <div className='dropdown-button-container'>
      <button
        type='button'
        className={`button ${className ?? ''}`}
        onClick={onClickHandler}
        disabled={disabled}
      >
        {text}
        <button type='button' onClick={handleDropdownClick} className='more-button'>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </button>
      {showDropdown && (
        <div className={`dropdown-container ${dropdownClassName ?? ''}`}>{children}</div>
      )}
    </div>
  );
};
