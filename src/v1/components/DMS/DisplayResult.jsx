import React from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import moment from 'moment';
import './DisplayResult.module.scss';
import { setFilters } from '../../../actions/dms';

export const DisplayResult = (props) => {
  const dispatch = useDispatch();
  const { title, data, setSearchVal, searchFilters = [] } = props;

  const handleTagsMouseDown = (type, item) => {
    const filterPreviouslySet = searchFilters.some((filter) => filter.item === item);
    if (!filterPreviouslySet) {
      const clonedSearchFilters = [...searchFilters];
      clonedSearchFilters.push({ type, item });
      dispatch(setFilters(clonedSearchFilters));
    }
    setSearchVal('');
  };

  if (title === 'documents' || title === 'invoices') {
    const isDocuments = title === 'documents';

    return (
      <ul className='result-list'>
        {data.map((item) => {
          const { id, filename, category, created_at: createdAt, added_date: addedDate } = item;
          const hrefPath = category === 'invoice' ? '/invoice' : '/document-preview';
          return (
            <div
              role='presentation'
              className='document-results'
              key={id}
              onMouseDown={() => Router.push(`${hrefPath}?id=${id}`)}
            >
              <li className='document-name'>{filename}</li>
              <span className='document-number-date'>
                <li className='document-date'>
                  {moment.unix(isDocuments ? addedDate : createdAt).format('DD/MM/YYYY')}
                </li>
              </span>
            </div>
          );
        })}
      </ul>
    );
  }

  if (title === 'sp_number') {
    return (
      <div>
        {data.map((item, index) => (
          <span
            role='presentation'
            className='display-result result-container'
            key={index}
            onMouseDown={() => {
              handleTagsMouseDown(title, item);
            }}
          >
            <span className='result-name'>{item}</span>
            <span className='result-plus'>+</span>
          </span>
        ))}
      </div>
    );
  }

  if (title === 'images') {
    return (
      <div className='result-list'>
        {data.map((item) => {
          const { id, display_name: displayName, url, category, created_at: createdAt } = item;
          const hrefPath = category === 'invoice' ? '/invoice' : '/document-preview';

          return (
            <div
              role='presentation'
              className='image-search-results'
              key={url}
              onMouseDown={() => Router.push(`${hrefPath}?id=${id}`)}
            >
              <img className='image-search-display' src={url} alt={displayName} />
              <span className='image-search-list'>
                <span className='image-search-item'>
                  <span className='image-search-name'>{displayName}</span>
                </span>
                <span className='image-search-date'>
                  {moment.unix(createdAt).format('DD/MM/YYYY')}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (data && title !== 'documents') {
    return (
      <div>
        {data.map((item) => (
          <span
            role='presentation'
            className='display-result result-container'
            key={item}
            onMouseDown={() => {
              handleTagsMouseDown(title, item);
            }}
          >
            {title === 'Manager' ? <span>IMAGE</span> : null}
            <span className='result-name'>{item}</span>
            <span className='result-plus'>+</span>
          </span>
        ))}
      </div>
    );
  }
  return null;
};
