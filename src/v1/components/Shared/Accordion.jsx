import { useState } from 'react';
import './Accordion.module.scss';

const Accordion = ({ title, children, defaultCollapse = true }) => {
  const [collapse, setCollapse] = useState(defaultCollapse);
  return (
    <div className='accordion'>
      <h2 className='accordion__header'>
        <button
          className={`accordion__button ${collapse ? 'collapsed' : ''}`}
          type='button'
          aria-expanded='true'
          onClick={() => setCollapse(!collapse)}
        >
          {title}
          <h3 style={{ fontWeight: 'normal' }}>&#8964;</h3>
        </button>
      </h2>
      <div className={`accordion__collapse ${collapse ? '' : 'show'}`}>
        <div className='accordion__body'>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
