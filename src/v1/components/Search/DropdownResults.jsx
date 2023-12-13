import React, { useMemo } from 'react';
import { DisplayResult } from './DisplayResult';

export const DropdownResults = ({
  title,
  value,
  setFilters,
  setSearchVal,
  searchFilters,
  searchResults,
  handleSubmit
}) => {
  const elementClass = useMemo(() => {
    switch (title) {
      case 'documents':
        return 'documents-search-content';
      case 'images':
        return 'image-search-content';
      default:
        return 'content';
    }
  }, [title]);

  return (
    <>
      {title === 'search' ? (
        <div
          role='presentation'
          className='content search-result'
          onMouseDown={(e) => handleSubmit(e, true)}
        >
          Search for <span className='search-value'>'{value}'</span>
        </div>
      ) : (
        <div className={elementClass}>
          <DisplayResult
            title={title}
            data={searchResults[title]}
            value={value}
            setFilters={setFilters}
            setSearchVal={setSearchVal}
            searchFilters={searchFilters}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </>
  );
};
