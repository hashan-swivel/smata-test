import React, { useState } from 'react';
import './MapMarker.module.scss';

export const Marker = ({ type, name }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className='marker-container'>
      {name && (
        <div className={`hover-info ${showTooltip ? 'active' : 'inactive'}`}>
          <span>{name}</span>
        </div>
      )}
      <div
        onMouseOver={() => setShowTooltip(true)}
        onFocus={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        onBlur={() => setShowTooltip(false)}
        className='marker'
      />
      {type === 'main' && <div className='pulse' />}
    </div>
  );
};
