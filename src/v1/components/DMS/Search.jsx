import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import queryString from 'query-string';
import { axiosInstance } from '../../../utils';
import { SearchDropdown } from './SearchDropdown';
import {
  setFilters,
  setFilteredItems,
  setSearchValue,
  setDocumentsLoading,
  setSearchItems
} from '../../../actions/dms';
import { Link } from '../Link';
import { modalActions } from '../../../actions';

import './Search.module.scss';
import { documentConstants } from '../../../constants';

export const Search = ({ placeholder, viewType, dateRange, sort, order, currentPage, perPage }) => {
  const dispatch = useDispatch();
  const [dateStart, dateEnd] = dateRange;
  const [searchVal, setSearchVal] = useState('');
  const [focused, setFocused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [submitBlur, setSubmitBlur] = useState(true);
  const [loading, setLoading] = useState(false);
  const toggleActions = useSelector((state) => state.dms.toggleActions);
  const searchFilters = useSelector((state) => state.dms.searchFilters);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const filterAll = useMemo(() => toggleActions.all, [toggleActions]);
  const filterFavorites = useMemo(() => toggleActions.favorite, [toggleActions]);
  const filterMyTasks = useMemo(() => toggleActions.task, [toggleActions]);
  const filterPriorityInvoices = useMemo(() => toggleActions.priority_invoice, [toggleActions]);
  const filterOnlyDeleted = useMemo(() => toggleActions.deleted, [toggleActions]);
  const filterOnlyDuplicates = useMemo(() => toggleActions.duplicate, [toggleActions]);

  const isFirstRun = useRef(true);

  const hasFiltered = useMemo(
    () =>
      filterAll ||
      filterFavorites ||
      filterMyTasks ||
      filterPriorityInvoices ||
      filterOnlyDeleted ||
      filterOnlyDuplicates,
    [
      filterAll,
      filterFavorites,
      filterMyTasks,
      filterPriorityInvoices || filterOnlyDeleted,
      filterOnlyDuplicates
    ]
  );

  useEffect(() => {
    setSearchVal('');
    setFocused(false);
    setSearchResults([]);
  }, [viewType]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (searchVal !== '') return;
    if (!searchFilters.length) {
      setSearchItems(null);
      getFilteredDocuments();
      return;
    }

    getSearchDocuments();

    const fetchData = async () => {
      // NOTE: Should be refactored, documents.js is also making a call to fetch documents with filters
      const results = await getFilteredDocuments();
      setSearchItems(results);
    };

    fetchData();
  }, [searchVal, searchFilters]);

  /**
   * Perform the document filteration again when the toggles/sort/order/perPage/currentPage are changed
   */
  useEffect(() => {
    if (searchVal !== '') {
      const fetchData = async () => {
        const results = await getFilteredDocuments(searchVal, true);
        setSearchItems(results);
      };
      fetchData();
    }
  }, [hasFiltered, sort, order, perPage, currentPage]);

  /**
   * Sync the search value in the redux store with search text
   */
  useEffect(() => {
    dispatch(setSearchValue(searchVal));
  }, [searchVal]);

  const getSearchDocuments = async (q) => {
    setLoading(true);
    const filters = searchFiltersQueryObject();

    const requestData = {
      q,
      ...filters,
      end_date: dateEnd,
      is_invoice: viewType === 'invoices',
      start_date: dateStart
    };

    if (filterAll) {
      requestData.scope = 'all';
    }

    if (filterMyTasks) {
      requestData.my_tasks = true;
    }

    if (filterFavorites) {
      requestData.favorites = true;
    }

    if (filterPriorityInvoices) {
      requestData.priority_invoices = true;
    }

    if (filterOnlyDeleted) {
      requestData.only_deleted = true;
    }

    if (filterOnlyDuplicates) {
      requestData.invoice_duplicate = true;
    }

    const query = queryString.stringify(requestData);
    const { data } = await axiosInstance.get(`/v1/documents/search?${query}`);

    setLoading(false);
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
      user_name: data?.user_name || []
    });

    return data.documents;
  };

  const getFilteredDocuments = async (q, didPressEnter) => {
    dispatch(setDocumentsLoading(true));

    const filters = searchFiltersQueryObject();
    const searchTerms = {};

    if (didPressEnter && Object.keys(filters).length === 0) {
      searchTerms.full_search = q;
    } else {
      searchTerms.q = q;
    }

    if (hasFiltered) {
      const query = queryString.stringify({
        ...searchTerms,
        ...filters,
        favorites: filterFavorites,
        my_tasks: filterMyTasks,
        priority_invoices: filterPriorityInvoices,
        only_deleted: filterOnlyDeleted,
        invoice_duplicate: filterOnlyDuplicates,
        is_invoice: viewType === 'invoices',
        organisation_id: currentUser.organisation_id,
        start_date: dateStart,
        end_date: dateEnd,
        scope: filterAll ? 'all' : null,
        order,
        sort,
        page: currentPage,
        per_page: perPage
      });

      const endPoint = filterAll ? '/v1/documents/organisation_documents' : '/v1/documents';
      const apiUrl = `${endPoint}?${query}`;
      const { data } = await axiosInstance.get(apiUrl);

      await dispatch(setFilteredItems(data));
      dispatch(setDocumentsLoading(false));

      return data;
    }

    const query = queryString.stringify({
      ...searchTerms,
      ...filters,
      is_invoice: viewType === 'invoices',
      order,
      sort,
      page: currentPage,
      per_page: perPage
    });

    const apiUrl = `/v1/documents?${query}`;
    const { data } = await axiosInstance.get(apiUrl);

    await dispatch(setFilteredItems(data));
    dispatch(setDocumentsLoading(false));

    return data;
  };

  const searchFiltersQueryObject = () => {
    const filters = {};

    searchFilters.forEach((searchFilter) => {
      let key = searchFilter.type;
      if (key === 'type') key = 'category';
      if (key === 'tag') key = 'tags';
      if (key === 'amounts') key = 'amount';
      filters[key] = searchFilter.item;
    });

    if (
      filters.category &&
      documentConstants.LEVY_NOTICES_CATEGORIES.includes(filters.category.trim().toLowerCase())
    ) {
      filters.is_levy_notice = true;
      filters.category = null;
    } else {
      filters.is_levy_notice = null;
    }
    return filters;
  };

  // Set time for when user stops typing, make search query to API
  const useDebouncedEffect = (effect, deps, delay) => {
    useEffect(() => {
      const handler = setTimeout(() => effect(), delay);

      return () => clearTimeout(handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(deps || []), delay]);
  };

  useDebouncedEffect(() => searchTimer(searchVal), [searchVal], 350);

  const searchTimer = (value) => {
    if (value) getSearchDocuments(value);
  };

  const handleChange = (event) => {
    onFocus();
    const { value } = event.target;
    setSearchVal(value);
  };

  const handleSubmit = async (event, enterPressed) => {
    if (event) event.preventDefault();

    if (searchVal) {
      const results = await getFilteredDocuments(searchVal, enterPressed);
      setSearchItems(results);
    }

    setSubmitBlur(false);
  };

  const onFocus = () => {
    setFocused(true);
    setSubmitBlur(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  return (
    <div className='dms-search'>
      <form className='form' onSubmit={(e) => handleSubmit(e, true)}>
        <div className='dms-search-box'>
          <span className={`dms-search-tags ${focused ? 'active' : ''}`}>
            <SearchFilters searchFilters={searchFilters} focused={focused} viewType={viewType} />
          </span>
          <input
            className='dms-search-input input'
            type='text'
            placeholder={placeholder || 'Search by name, type, building, manager and more'}
            value={searchVal}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </form>
      {(searchVal || !!searchFilters.length) && focused && submitBlur && (
        <div className='dms-search-dropdown'>
          <span>
            <SearchDropdown
              value={searchVal}
              setSearchVal={setSearchVal}
              searchFilters={searchFilters}
              searchResults={searchResults}
              handleSubmit={handleSubmit}
              viewType={viewType}
              isLoading={loading}
            />
          </span>
        </div>
      )}
      <button
        type='button'
        className='button button--link button--search-tip'
        onClick={() => dispatch(modalActions.showModal('SEARCH_TIP', {}))}
      >
        <FontAwesomeIcon icon={faInfoCircle} size='lg' />
      </button>
    </div>
  );
};

const SearchFilters = ({ searchFilters, viewType }) => {
  const dispatch = useDispatch();
  if (!searchFilters || searchFilters.length < 1) {
    return null;
  }

  const resetFilters = async (filter) => {
    const reducedFilter = searchFilters.filter((searchFilter) => searchFilter.item !== filter.item);
    await dispatch(setFilters(reducedFilter));
  };

  return (
    <>
      {searchFilters.map((searchFilter) => (
        <span key={searchFilter}>
          {searchFilter.item}
          <Link
            role='presentation'
            classNameProp='icon-after icon-cross-white'
            onClick={() => resetFilters(searchFilter)}
          />
        </span>
      ))}
    </>
  );
};
