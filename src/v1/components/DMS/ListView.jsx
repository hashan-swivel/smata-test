import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ListViewItem } from './ListViewItem';
import { userOptionObj } from '../../../utils/addLabelValue';
import { documentConstants } from '../../../constants';
import { PerPageOptions, PaginationOptions } from '../Pagination';

export const ListView = ({
  actionRequired,
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
  priorities,
  unseenDocuments,
  viewType,
  expandedRows,
  setLoading
}) => {
  const [windowWidth, setWindowWidth] = useState(0); // to calculate if the document notes should be truncated

  const currentUser = useSelector((state) => state.auth.currentUser);
  const meta = useSelector((state) => state.dms.meta);
  const [activeDropDownId, setActiveDropDownId] = useState('');
  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  /**
   * Window resize event handler
   */
  useEffect(() => {
    const windowResizeHandler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', windowResizeHandler);

    return () => window.removeEventListener('resize', windowResizeHandler);
  }, []);

  function handlePerPageClicked(amount) {
    setCurrentPage(1);
    setPerPage(parseInt(amount, 10));
  }

  const getCurrentApprover = (invoiceItem) => {
    const approvers = invoiceItem.currently_with_user_details;
    const { my_tasks: myTasks = [] } = meta;
    const requiresMyAction = myTasks.includes(invoiceItem.id);

    if (requiresMyAction) {
      return [currentUser];
    }

    return approvers;
  };

  const getCurrentlyTimeWith = (invoiceItem) => {
    const approvers = invoiceItem.currently_with_user_details;
    return approvers[0]?.time_with;
  };

  if (!items) return null;

  return (
    <section
      className={`${
        viewType === 'invoices' ? 'invoices-list-view' : 'documents-list-view'
      } document-list-items dms-list-view`}
    >
      {items.map((item) => (
        <ListViewItem
          key={item.id}
          item={item}
          selected={selected}
          setSelected={setSelected}
          setReload={setReload}
          favorites={favorites}
          priorities={priorities}
          action={actionRequired && actionRequired.includes(item.id)}
          unseen={unseenDocuments && unseenDocuments.includes(item.id)}
          viewType={viewType}
          currentlyWithUser={
            getCurrentApprover(item)
              ? getCurrentApprover(item).map((user) => userOptionObj(user))
              : null
          }
          expandedRows={expandedRows}
          timeWith={getCurrentlyTimeWith(item)}
          setLoading={setLoading}
          windowWidth={windowWidth}
          activeDropDownId={activeDropDownId}
          toggleDropDown={(toggleId) => setActiveDropDownId(toggleId)}
        />
      ))}
      <PaginationOptions
        totalItems={count}
        perPage={perPage}
        changePage={changePage}
        currentPage={currentPage}
      />
      <PerPageOptions
        options={documentConstants.DEFAULT_PER_PAGE_OPTIONS}
        perPage={perPage}
        onPerPageClicked={handlePerPageClicked}
      />
    </section>
  );
};
