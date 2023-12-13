import React from 'react';
import { DropdownResults } from './DropdownResults';
import './SearchDropdown.module.scss';
import { searchOptions } from '../../../utils/helpers';

export const SearchDropdown = ({
  value,
  setFilters,
  setSearchVal,
  searchFilters,
  searchResults,
  handleSubmit,
  type
}) => {
  // Get available titles from search results
  // All titles should have an icon and title to reference from the const objects declared above
  const searchTitles = [];
  Object.keys(searchResults).forEach((key) => {
    if (searchResults[key].length) {
      if (key === 'documents') {
        searchTitles.unshift(key);
      } else {
        searchTitles.push(key);
      }
    }
  });

  searchTitles.push('search');

  return (
    <div className='dropdown-container'>
      {searchTitles.map((title) => (
        <div key={title}>
          <div className={`content search-title icon icon-${searchOptions[type].icons[title]}`}>
            <span>{searchOptions[type].titles[title]}</span>
          </div>
          <DropdownResults
            title={title}
            value={value}
            setFilters={setFilters}
            setSearchVal={setSearchVal}
            searchFilters={searchFilters}
            searchResults={searchResults}
            handleSubmit={handleSubmit}
          />
        </div>
      ))}
    </div>
  );
};
