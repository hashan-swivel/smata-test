import './ProgressBar.module.scss';
import React from 'react';

const getPaginationArr = (length, currentPage) => {
  if (length <= 5) {
    return Array(length)
      .fill()
      .map((x, i) => i);
  }

  if (currentPage < 3) {
    return [0, 1, 2, '...', length - 1];
  }

  if (currentPage === 3) {
    return [0, 1, 2, 3, '...', length - 1];
  }

  if (currentPage > length - 2) {
    return [0, '...', length - 3, length - 2, length - 1];
  }

  if (currentPage > length - 3) {
    return [0, '...', currentPage - 2, currentPage - 1, currentPage, length - 1];
  }

  return [0, '...', currentPage - 2, currentPage - 1, currentPage, '...', length - 1];
};

const PaginationOptions = ({ perPage, totalItems, changePage, currentPage = 1 }) => {
  const currentPageInt = parseInt(currentPage, 10);
  const pageNumbers = getPaginationArr(Math.ceil(totalItems / perPage), currentPageInt);
  const firstPage = pageNumbers[0] + 1;
  const prevPage = currentPageInt > firstPage ? currentPageInt - 1 : firstPage;
  const lastPage = pageNumbers[pageNumbers.length - 1] + 1;
  const nextPage = currentPageInt < lastPage ? currentPageInt + 1 : lastPage;

  if (totalItems > perPage) {
    return (
      <ul className='pagination__pager'>
        {currentPageInt > 1 && (
          <>
            <li
              className='pagination__page pagination__page--bold'
              onClick={() => changePage(firstPage)}
            >
              « First
            </li>
            <li
              className='pagination__page pagination__page--bold'
              onClick={() => changePage(prevPage)}
            >
              ‹ Prev
            </li>
          </>
        )}

        {pageNumbers.map((number, index) => {
          if (number === '...')
            return (
              <li key={`ellipse-${index}`} className='pagination__ellipse' style={{ listStyleType:'none' }}>
                ...
              </li>
            );
          return (
            <li
              key={number}
              className={`pagination__page pagination__page--bold pagination__page--${
                currentPage === number + 1 ? 'active' : 'inactive'
              }`}
              onClick={() => changePage(number + 1)}
            >
              {number + 1}
            </li>
          );
        })}

        {currentPageInt < lastPage && (
          <>
            <li
              className='pagination__page pagination__page--bold'
              onClick={() => changePage(nextPage)}
            >
              Next ›
            </li>
            <li
              className='pagination__page pagination__page--bold'
              onClick={() => changePage(lastPage)}
            >
              Last »
            </li>
          </>
        )}

        <li className='pagination__total'>({totalItems})</li>
      </ul>
    );
  }

  return null;
};

const PerPageOptions = ({ options, perPage, onPerPageClicked }) => (
  <ul className='pagination__perPage'>
    <li className='pagination__perPageLabel'>Per Page:</li>
    {Object.entries(options).map(([key, value]) => (
      <li
        key={key}
        className={`pagination__perPageOption pagination__perPageOption--${
          perPage?.toString() === key.toString() ? 'active' : 'inactive'
        }`}
        onClick={() => onPerPageClicked(key)}
      >
        {value}
      </li>
    ))}
  </ul>
);

// Dumb components
export { PerPageOptions, PaginationOptions };
