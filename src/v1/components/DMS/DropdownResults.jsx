import React from 'react';
import { DisplayResult } from './DisplayResult';

export const DropdownResults = (props) => {
  const { title, value, setSearchVal, searchFilters, searchResults, handleSubmit, viewType } =
    props;

  const data = searchResults[title];

  if (title === 'documents' && viewType === 'documents') {
    return (
      <div className='documents-search-content'>
        <DisplayResult
          title={title}
          data={data?.slice(0, 4)}
          value={value}
          setSearchVal={setSearchVal}
          searchFilters={searchFilters}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }
  if (title === 'images') {
    return (
      <div className='image-search-content'>
        <DisplayResult
          title={title}
          data={data?.splice(0, 3)}
          value={value}
          setSearchVal={setSearchVal}
          searchFilters={searchFilters}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }
  if (title !== 'search' && title !== 'documents') {
    return (
      <div className='content'>
        <DisplayResult
          title={title}
          data={title === 'invoices' ? data?.splice(0, 4) : data}
          value={value}
          setSearchVal={setSearchVal}
          searchFilters={searchFilters}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }
  if (title === 'search') {
    return (
      <div role='presentation' className='content search-result' onMouseDown={handleSubmit}>
        Text/Image search for <span className='search-value'>'{value}'</span>
      </div>
    );
  }

  return null;
};
