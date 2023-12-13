import React from 'react';
import { DropdownResults } from './DropdownResults';
import { searchOptions } from '../../../utils/helpers';
import './SearchDropdown.module.scss';
import { Loading } from '../Loading';

export const SearchDropdown = (props) => {
  const { value, setSearchVal, searchFilters, searchResults, handleSubmit, viewType, isLoading } =
    props;

  // Get available titles from search results
  // All titles should have an icon and title to reference from the const objects declared above
  const searchTitles = [];
  Object.keys(searchResults).forEach((key) => {
    if (searchResults[key].length) {
      searchTitles.push(key);
    }
  });

  searchTitles.push('search');

  return (
    <div className='dropdown-container'>
      {isLoading && <Loading />}
      {searchTitles.map((title) => (
        <div key={title}>
          <div className={`content search-title icon icon-${searchOptions.documents.icons[title]}`}>
            <span>{searchOptions.documents.titles[title]}</span>
          </div>
          <DropdownResults
            title={title}
            value={value}
            setSearchVal={setSearchVal}
            searchFilters={searchFilters}
            searchResults={searchResults}
            handleSubmit={handleSubmit}
            viewType={viewType}
          />
        </div>
      ))}
    </div>
  );
};
