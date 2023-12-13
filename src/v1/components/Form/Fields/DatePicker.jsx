import React, { useRef } from 'react';
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';

export const DatePicker = (props) => {
  const { input, placeholder, disabled, defaultDate, customOptions } = props;
  const refComp = useRef(null);

  const clearDate = () => {
    refComp.current.flatpickr.clear();
  };

  return (
    <div className='datepicker-container' style={{ position: 'relative' }}>
      <Flatpickr
        options={customOptions ?? { dateFormat: 'd/m/Y' }}
        {...input}
        placeholder={placeholder}
        disabled={disabled}
        defaultDate={defaultDate}
        ref={refComp}
      />
      {input?.value?.length !== 0 && (
        <button
          type='button'
          className='icon icon-cross-red clear-datepicker-btn'
          style={{
            background: 'none',
            border: 'none',
            top: '13px',
            right: '3px',
            position: 'absolute',
            display: 'flex'
          }}
          onClick={clearDate}
        />
      )}
    </div>
  );
};
