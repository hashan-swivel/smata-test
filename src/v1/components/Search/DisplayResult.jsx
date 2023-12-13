import React from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import Moment from 'moment';
import './DisplayResult.module.scss';

export const DisplayResult = ({ title, data, setFilters, setSearchVal, searchFilters }) => {
  const dispatch = useDispatch();
  const handleTagsMouseDown = (type, item) => {
    const filterPreviouslySet = searchFilters.some((filter) => filter.item === item);

    if (!filterPreviouslySet) {
      const clonedSearchFilters = [...searchFilters];
      clonedSearchFilters.push({ type, item });
      dispatch(setFilters(clonedSearchFilters));
    }
    setSearchVal('');
  };

  if (data && title === 'site_plan_ids') {
    return (
      <div>
        {data.map((item, index) => (
          <span
            role='presentation'
            className='display-result result-container'
            key={`item-${index}`}
            onMouseDown={() => {
              handleTagsMouseDown('sp_number', item.sp_number);
            }}
          >
            <span className='result-name'>{item.sp_number}</span>
            <span className='result-plus'>+</span>
          </span>
        ))}
      </div>
    );
  }

  if (title === 'documents' || title === 'invoices') {
    return (
      <ul className='result-list'>
        {data.map((item) => {
          const { id, filename, category, created_at: createdAt } = item;
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
                <li className='document-date'>{Moment.unix(createdAt).format('DD/MM/YYYY')}</li>
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
            key={`item-${index}`}
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
                  {Moment.unix(createdAt).format('DD/MM/YYYY')}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (title === 'messages') {
    return (
      <ul className='result-list'>
        {data.map((item, index) => {
          const { body, chat_room_id, created_at } = item;
          return (
            <div
              role='presentation'
              className='document-results'
              key={`item-${index}`}
              onMouseDown={() => Router.push(`/messages?id=${chat_room_id}`)}
            >
              <li className='document-name'>{body}</li>
              <span className='document-number-date'>
                <li className='document-date'>{Moment.unix(created_at).format('DD/MM/YYYY')}</li>
              </span>
            </div>
          );
        })}
      </ul>
    );
  }

  if (title === 'chat_rooms') {
    return (
      <ul className='result-list'>
        {data.map((item, index) => {
          const { id, name } = item;
          return (
            <div
              role='presentation'
              className='document-results'
              key={`item-${index}`}
              onMouseDown={() => Router.push(`/messages?id=${id}`)}
            >
              <li className='document-name'>{name}</li>
            </div>
          );
        })}
      </ul>
    );
  }

  if (title === 'contacts') {
    return (
      <div>
        {data.map((item, index) => (
          <span
            role='presentation'
            className='display-result result-container'
            key={`item-${index}`}
            onMouseDown={() => {
              handleTagsMouseDown('user_name', item.name);
            }}
          >
            <span className='result-name'>{item.name}</span>
            <span className='result-plus'>+</span>
          </span>
        ))}
      </div>
    );
  }

  if (title === 'building_addresses') {
    return (
      <div>
        {data.map((item, index) => (
          <span
            role='presentation'
            className='display-result result-container'
            key={`item-${index}`}
            onMouseDown={() => {
              handleTagsMouseDown('location_name', item.location_name);
            }}
          >
            <span className='result-name'>{item.location_name}</span>
            <span className='result-plus'>+</span>
          </span>
        ))}
      </div>
    );
  }

  if (data && title !== 'documents') {
    return (
      <div>
        {data.map((item, index) => (
          <span
            role='presentation'
            className='display-result result-container'
            key={`item-${index}`}
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
