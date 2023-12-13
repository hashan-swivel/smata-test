import React, { useState } from 'react';
import './Accordion.module.scss';

const Accordion = ({ title, children, initOpen = true }) => {
  const [isOpen, setOpen] = useState(initOpen);
  return (
    <div className='accordion-wrapper document-view-block'>
      <div className={`accordion-title ${isOpen ? 'open' : ''}`} onClick={() => setOpen(!isOpen)}>
        <h3 className='document-view-block-title h3'>{title}</h3>
      </div>
      <div className={`accordion-item ${!isOpen ? 'collapsed' : ''}`}>
        <div className='accordion-content'>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
