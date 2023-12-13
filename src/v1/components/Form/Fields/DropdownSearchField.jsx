import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { axiosInstance } from '../../../../utils/axiosInstance';
import './DropdownSearchField.module.scss';

export const DropdownSearchField = (props) => {
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [queryResults, setQueryResults] = useState([]);

  const { input: reduxInput, placeholder, searchType, iconSvg } = props;
  const currentField = reduxInput.name;

  // Display dropdown and search api when searchVal exists
  useEffect(() => {
    if (searchVal !== '') {
      setShowDropdown(true);
      queryApi(searchVal);
    } else {
      setShowDropdown(false);
      setQueryResults([]);
    }
  }, [searchVal]);

  // Set the api searchVal to the input value
  const handleChange = (event) => {
    const { value } = event.target;
    setSearchVal(value);
  };

  // Query the api with the searchVal
  const queryApi = async (q) => {
    setLoading(true);
    const query = queryString.stringify({ q });
    await axiosInstance
      .get(`/v1/${searchType}/search?${query}`)
      .then((res) => setQueryResults(res.data[searchType]))
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  };

  return (
    <div className='search-field-container'>
      <input
        type='text'
        onChange={handleChange}
        value={searchVal}
        placeholder={placeholder || null}
      />
      {showDropdown && (
        <div className='search-dropdown-container'>
          <div className={`dropdown-header ${iconSvg ? `icon icon-${iconSvg}` : null}`}>
            {searchType}
          </div>
          {queryResults.length >= 1 ? (
            queryResults.map((item) => (
              <div key={item.id} className='search-dropdown-item'>
                <div role='presentation' className='dropdown-label'>
                  {item.name}
                </div>
              </div>
            ))
          ) : (
            <div className='loading-no-results'>{loading ? 'Loading...' : 'No results'}</div>
          )}
        </div>
      )}
    </div>
  );
};
