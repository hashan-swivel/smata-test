import React from 'react';
import { MessageDropdownResults } from './MessageDropdownResults';
import '../DMS/SearchDropdown.scss';

export const MessageSearchDropdown = (props) => {
  const { value, reduxInput, addToRedux, setSearchVal } = props;
  return (
    <div className='dropdown-container'>
      <div>
        <span className='content search-title'>{reduxInput.name}</span>
      </div>
      <MessageDropdownResults
        setSearchVal={setSearchVal}
        title={reduxInput.name}
        value={value}
        addToRedux={addToRedux}
      />
    </div>
  );
};
