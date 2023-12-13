import React from 'react';
import Switch from 'react-switch';
import './Toggle.module.scss';

export const Toggle = (props) => {
  const { onChange, checked, disabled, label, input } = props;

  const checkOnChange = () => {
    if (onChange) {
      return onChange(!checked);
    }
    if (input.onChange) {
      return input.onChange(!checked);
    }
  };

  return (
    <div className='toggle'>
      <Switch
        onChange={onChange || input.onChange}
        checked={checked}
        disabled={disabled}
        onColor='#4FCBB2'
        offColor='#333333'
        height={20}
        width={36}
        handleDiameter={16}
        uncheckedIcon={false}
        checkedIcon={false}
      />
      {label && (
        <span
          className='toggle-label'
          role='switch'
          tabIndex='0'
          aria-checked={checked}
          onClick={checkOnChange}
        >
          {label}
        </span>
      )}
    </div>
  );
};
