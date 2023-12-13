import React, { useState } from 'react';
import { connect } from 'react-redux';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from '../Loading';
import InspectionDropdownList from './InspectionDropdownList';
import InspectionSessionTimer from './InspectionSessionTimer';

import './InspectionSessions.module.scss';

const InspectionSessions = ({ currentSession, currentSessionLoading }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dropdownToggle = () => {
    if (currentSessionLoading) {
      return <Loading fill='#fff' componentLoad />;
    }

    if (currentSession) {
      return <InspectionSessionTimer currentSession={currentSession} />;
    }

    return (
      <div className='current-building-inspection-session'>
        <h4>Select Building</h4>
      </div>
    );
  };

  return (
    <div className='navbar-menu-item building-inspection-session-dropdown-container'>
      <div
        role='presentation'
        className='building-inspection-session-header-dropdown-container'
        onClick={handleDropdown}
      >
        {dropdownToggle()}
        &nbsp;&nbsp;
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      {dropdownOpen && <InspectionDropdownList setDropdownOpen={setDropdownOpen} />}
    </div>
  );
};

export default connect((state) => state.buildingInspectionSessions)(InspectionSessions);
