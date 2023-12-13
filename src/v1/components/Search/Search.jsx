import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { axiosInstance } from '../../../utils/axiosInstance';
import './Search.module.scss';
import { SearchDropdown } from './SearchDropdown';
import { Link } from '../Link';

export const Search = ({
  apiUrl,
  placeholder,
  searchFilters,
  setFilteredItems,
  setFilters,
  type,
  showAll,
  showArchived
}) => {
  const dispatch = useDispatch();
  const [searchVal, setSearchVal] = useState('');
  const [focused, setFocused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [submitBlur, setSubmitBlur] = useState(true);
  const isFirstRun = useRef(true);

  useEffect(() => {
    setSearchVal('');
    setFocused(false);
    setSearchResults([]);
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (searchVal !== '') return;

    if (searchFilters.length) {
      getSearchData(searchVal);
    }

    getFilteredData(searchVal);
  }, [searchVal, searchFilters]);

  useEffect(() => {
    if (searchVal || searchFilters?.length) {
      getFilteredData(searchVal);
    }
  }, [showAll, showArchived]);

  // Set time for when user stops typing, make search query to API
  const searchTimer = (value) =>
    setTimeout(() => {
      getSearchData(value);
    }, 700);

  const handleChange = (event) => {
    const { value } = event.target;
    setFocused(true);
    setSearchVal(value || '');
    // Reset time for searchTimer function each keystroke
    if (timer) clearTimeout(timer);
    setTimer(searchTimer(value));
  };

  const handleSubmit = (event, enterPressed) => {
    if (event) event.preventDefault();

    if (searchVal.length > 0 || searchFilters.length > 0) {
      setSubmitBlur(false);
      getFilteredData(searchVal, enterPressed);
    }
  };

  const onFocus = () => {
    setFocused(true);
    setSubmitBlur(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const resetFilters = async (filter) => {
    const reducedFilter = searchFilters.filter((searchFilter) => searchFilter.item !== filter.item);
    await dispatch(setFilters(reducedFilter));
  };

  const getSearchData = async (q) => {
    try {
      if (!q) {
        // empty query but still the cursor is active
        // set focus state and retun
        setFocused(true);
        setSubmitBlur(true);
        return;
      }

      const filters = searchFiltersQueryObject();

      if (q) {
        filters.q = q;
      }

      if (type === 'messages' && showAll) {
        filters.show_all = true;
      }

      const query = queryString.stringify(filters);
      const endpoint = `/v1/${apiUrl}${query ? `?${query}` : ''}`;
      const { data } = await axiosInstance.get(endpoint);

      setSearchResults({
        sp_number: data?.sp_number || [],
        invoice_number: data?.invoice_number || [],
        type: data?.type || [],
        tag: data?.tag || [],
        amounts: data?.amounts || [],
        contractor: data?.contractor || [],
        lot_number: data?.lot_number || [],
        invoice_status: data?.invoice_status || [],
        documents: data?.documents || [],
        invoices: data?.invoices || [],
        images: data?.images || [],
        messages: data?.messages || [],
        chat_rooms: data?.chat_rooms || [],
        contacts: data?.users || [],
        building_addresses: data?.building_addresses || [],
        site_plan_ids: data?.sp_numbers || []
      });

      return data[type];
    } catch (e) {
      // set focus state again
      setFocused(true);
      setSubmitBlur(true);
    }
  };

  const getFilteredData = (q, didPressEnter = false) => {
    const searchTerms = {};
    const filters = searchFiltersQueryObject(q, didPressEnter, searchTerms);

    let endpoint = '';
    if (didPressEnter === true) {
      endpoint = 'chat_rooms/search_without_tags';
    } else {
      endpoint =
        apiUrl === 'messages' ? `chat_rooms${showArchived ? '/archived_chat_rooms' : ''}` : apiUrl;
    }

    const query = queryString.stringify({ ...searchTerms, ...filters, users: true });
    axiosInstance.get(`/v1/${endpoint}?${query}`).then((res) => {
      dispatch(setFilteredItems(res.data));
    });
  };

  const searchFiltersQueryObject = (q, didPressEnter = false, searchTerms = {}) => {
    const filters = {};

    searchFilters.forEach((searchFilter) => {
      let key = searchFilter.type;
      if (key === 'type') key = 'category';
      if (key === 'tag') key = 'tags';
      if (key === 'amounts') key = 'amount';
      filters[key] = searchFilter.item;
    });

    if (type === 'messages' && showAll) {
      filters.show_all = true;
    }

    searchTerms.q = q;

    return filters;
  };

  return (
    <div className='search'>
      <form onSubmit={(e) => handleSubmit(e, true)}>
        <div className='search-box'>
          <span className={`search-tags ${focused ? 'active' : ''}`}>
            {searchFilters &&
              searchFilters.length > 0 &&
              searchFilters.map((searchFilter, index) => (
                <span key={index}>
                  {searchFilter.item}
                  <Link
                    role='presentation'
                    classNameProp='icon-after icon-cross-white'
                    onClick={() => resetFilters(searchFilter)}
                  />
                </span>
              ))}
          </span>
          <input
            className='search-input'
            type='text'
            placeholder={placeholder || 'Search'}
            value={searchVal}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </form>
      {searchResults && (searchVal || !!searchFilters.length) && focused && submitBlur && (
        <div className='search-dropdown'>
          <span>
            <SearchDropdown
              value={searchVal}
              setFilters={setFilters}
              setSearchVal={setSearchVal}
              searchFilters={searchFilters}
              searchResults={searchResults}
              handleSubmit={handleSubmit}
              type={type}
            />
          </span>
        </div>
      )}
    </div>
  );
};
