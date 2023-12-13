import React, { useState } from 'react';

import { GridViewItem } from './GridViewItem';
import { documentConstants } from '../../../constants';
import { PerPageOptions, PaginationOptions } from '../Pagination';
import { Loading } from '../index';

import './GridView.module.scss';

export const GridView = ({
  items,
  count,
  selected,
  setSelected,
  perPage,
  setPerPage,
  currentPage,
  setCurrentPage,
  setReload,
  favorites,
  loading
}) => {
  const changePage = (pageNumber) => setCurrentPage(pageNumber);
  const [activeDropDownId, setActiveDropDownId] = useState('');
  const changePerPage = (amount) => {
    setCurrentPage(1);
    setPerPage(parseInt(amount, 10));
  };

  if (!items) return null;
  if (loading) return <Loading componentLoad />;

  return (
    <>
      <section className='document-list-items dms-grid-view'>
        {items.map((item) => (
          <GridViewItem
            key={item.id}
            item={item}
            selected={selected}
            setSelected={setSelected}
            setReload={setReload}
            favorites={favorites}
            activeDropDownId={activeDropDownId}
            toggleDropDown={(toggleId) => setActiveDropDownId(toggleId)}
          />
        ))}
      </section>
      <PaginationOptions
        totalItems={count}
        perPage={perPage}
        changePage={changePage}
        currentPage={currentPage}
      />
      <PerPageOptions
        options={documentConstants.DEFAULT_PER_PAGE_OPTIONS}
        perPage={perPage}
        onPerPageClicked={changePerPage}
      />
    </>
  );
};
