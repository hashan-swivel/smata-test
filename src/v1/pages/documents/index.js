import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getDocuments, setFilters } from '@/actions/dms';
import { getOrgSpNumbers } from '@/actions/spNumbers';
import { Layout, Loading } from '@/components/v1';
import { GridView, Header, SortOptions, ListView, NotFound } from '@/components/v1/DMS';
import { datetimeConstants, documentConstants } from '@/constants';
import BulkActionBar from '@/components/v1/DMS/BulkActionBar';
import ProgressBar from '@/components/v1/ProgressBar';
import { modalActions } from '@/actions';

import './index.module.scss';

const _ = require('lodash');

const Documents = ({ dms, query }) => {
  const {
    showInvoice,
    sp_number: spNumberQuery,
    showMyTasks,
    invoice_status: invoiceStatusQuery,
    lot_number: lotNumber,
    document_type: documentType,
    financial_modal: financialModal
  } = query;
  const toggleState = useSelector((state) => state.dms.toggleActions);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [view, setView] = useState('list');
  const [expandedRows, setExpandedRows] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [actionRequired, setActionRequired] = useState([]);
  const [unseenDocuments, setUnseenDocuments] = useState([]);
  const [viewType, setViewType] = useState(
    toggleState.task || showInvoice === 'true' ? 'invoices' : 'documents'
  );
  const [invoiceCount, setInvoiceCount] = useState(0);

  const spList = useSelector((state) => state.spNumbers.orgSpNumbers);
  const spListLoading = useSelector((state) => state.spNumbers.loading);
  const exportStatus = useSelector((state) => state.dms.exportDocuments);
  const searchValue = useSelector((state) => state.dms.searchValue);
  const { order, sort } = useSelector((state) => state.dms.sortOptions);

  // Get access to dispatch
  const dispatch = useDispatch();

  const selectFile = (event, uid) => {
    const selectedArr = [...selected];
    const indexOfSelected = selectedArr.indexOf(uid);
    if (indexOfSelected !== -1) {
      selectedArr.splice(indexOfSelected, 1);
    } else {
      selectedArr.push(uid);
    }
    setSelected(selectedArr);
  };

  // const { documents, meta } = dms;
  const stateDms = useSelector((state) => state.dms);
  const {
    documents: stateDocuments,
    meta: stateMeta,
    loading: stateLoading,
    searchFilters,
    searchDocuments,
    searchMeta
  } = stateDms;
  const currentUser = useSelector((state) => state.auth.currentUser);
  const canToggleViewAllDocument =
    viewType === 'documents' &&
    (currentUser?.isSystemManager ||
      (currentUser.organisation_id && currentUser?.document_permissions?.['document.view_all']));
  const canToggleViewAllInvoice =
    viewType === 'invoices' &&
    (currentUser?.isSystemManager ||
      (currentUser.organisation_id && currentUser?.document_permissions?.['invoice.view_all']));

  // Fetch new documents when sort or page parameter changes
  useEffect(() => {
    if (searchValue && searchValue.length) return;
    let organisationId = null;

    if (canToggleViewAllDocument || canToggleViewAllInvoice) {
      if (
        toggleState.all ||
        toggleState.deleted ||
        toggleState.priority_invoice ||
        toggleState.favorite
      ) {
        organisationId = currentUser.organisation_id;
      }
    }

    const searchFiltersArr = spNumberQuery
      ? [{ item: spNumberQuery, type: 'sp_number' }]
      : searchFilters;

    if (invoiceStatusQuery) {
      searchFiltersArr.push({
        item: invoiceStatusQuery,
        type: 'invoice_status'
      });
    }

    if (lotNumber && _.find(searchFiltersArr, ['type', 'lot_number']) === undefined) {
      searchFiltersArr.push({ item: lotNumber, type: 'lot_number' });
    }

    if (documentType && _.find(searchFiltersArr, ['type', 'category']) === undefined) {
      searchFiltersArr.push({ item: documentType, type: 'category' });
      toggleState.all = true;
    }

    if (spNumberQuery && _.find(searchFiltersArr, ['type', 'sp_number']) === undefined) {
      searchFiltersArr.push({ item: spNumberQuery, type: 'sp_number' });
    }

    if (financialModal) {
      dispatch(modalActions.showModal('FINANCIAL_REPORT', {}));
    }

    if (spNumberQuery || invoiceStatusQuery || lotNumber || documentType)
      dispatch(setFilters(searchFiltersArr));
    dispatch(
      getDocuments(
        currentPage,
        perPage,
        order,
        sort,
        toggleState.favorite,
        toggleState.deleted,
        toggleState.duplicate,
        toggleState.task,
        toggleState.priority_invoice,
        dateRange,
        viewType,
        organisationId,
        searchFiltersArr
      )
    );
  }, [currentPage, perPage, order, sort, toggleState, dateRange, viewType]);

  /**
   * Reset currentPage or reload when the search value or search filters are empty
   */
  useEffect(() => {
    if (searchValue.length === 0 && searchFilters.length === 0) {
      if (currentPage === 1 && items.length) {
        // already in page 1, reload
        setReload(true);
      } else {
        setCurrentPage(1);
      }
    }
  }, [searchValue, searchFilters]);

  /**
   *  When the view type changes reset the selected items
   */
  useEffect(() => {
    setSelected([]);
    setAllSelected(false);
  }, [viewType, items]);

  // Fetch new documents when search query submitted
  useEffect(() => {
    if (searchDocuments) {
      setItems(searchDocuments);
      setTotalCount(searchMeta.total_count);
      setPerPage(searchMeta.per_page);
      setCurrentPage(searchMeta.meta.page || 1);
    } else {
      setItems(stateDocuments);
      setTotalCount(stateMeta.total_count);
      setPerPage(stateMeta.per_page);
      setCurrentPage(stateMeta.page || 1);
    }
  }, [searchDocuments]);

  // Update documents on client when getDocuments is dispatched above, runs every update when dms changes (api calls)
  useEffect(() => {
    // if there are already fetched search results, display them
    if (searchDocuments && searchDocuments.length > 0) return;

    setActionRequired(stateMeta.my_tasks);
    setUnseenDocuments(stateMeta.unseen_documents);
    setItems(stateDocuments);
    setTotalCount(stateMeta.total_count);
    setPerPage(stateMeta.per_page);
    setCurrentPage(stateMeta.page || 1);
    setLoading(false);
    setInvoiceCount(stateDocuments.filter((doc) => doc.category === 'invoice').length);
  }, [stateDocuments]);

  // Set documents from server on mount, only runs on mount/first load (not api calls)**
  useEffect(() => {
    setItems(stateDocuments);
    setTotalCount(stateMeta.total_count);
    setPerPage(stateMeta.per_page);
    setCurrentPage(stateMeta.page || 1);
    setLoading(false);
    const defaultView = window.localStorage.getItem(documentConstants.VIEW_TYPE_KEY) || 'list';
    const defaultExpandedView =
      window.localStorage.getItem(documentConstants.VIEW_EXPANDED_ROWS_KEY) === 'true' ||
      expandedRows;
    setView(defaultView);
    setExpandedRows(defaultExpandedView);
  }, []);

  const onDateChange = (e) => {
    if (e?.length === 0) setDateRange([]);
    if (e?.length === 2) {
      const dateArray = [];

      e.forEach((date) => {
        dateArray.push(moment(date).format(datetimeConstants.FORMAT.DEFAULT));
      });

      setDateRange(dateArray);
    }
  };

  const isLoading = loading || stateLoading;

  const getViewComponent = () => {
    if (isLoading && view === 'list') {
      return Loading;
    }
    if (!isLoading && items.length < 1) return NotFound;
    if (view === 'list') return ListView;
    return GridView;
  };

  useEffect(() => {
    if (reload) {
      let organisationId = null;

      if (canToggleViewAllDocument || canToggleViewAllInvoice) {
        if (
          toggleState.all ||
          toggleState.deleted ||
          toggleState.priority_invoice ||
          toggleState.favorite
        ) {
          organisationId = currentUser.organisation_id;
        }
      }
      dispatch(
        getDocuments(
          currentPage,
          perPage,
          order,
          sort,
          toggleState.favorite,
          toggleState.deleted,
          toggleState.duplicate,
          toggleState.task,
          toggleState.priority_invoice,
          dateRange,
          viewType,
          organisationId,
          searchFilters
        )
      );
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    const { organisation_id: orgId } = currentUser;
    if (!spList.length && spListLoading && orgId) dispatch(getOrgSpNumbers(orgId));
    // if (!tagsLibrary.length && tagsLibraryLoading) dispatch(getOrganisationTags());
  }, [currentUser, spList]);

  const selectAllDocument = (event) => {
    if (allSelected) {
      setAllSelected(false);
      setSelected([]);
    } else {
      setAllSelected(true);
      const itemIds = items.map((item) => item.id);
      setSelected(itemIds);
    }
  };

  const exportDocumentStatusContainer = () => (
    <ProgressBar completed={exportStatus.exportedPercent} labelStyles={{ fontSize: '0.9em' }} />
  );

  const ViewComponent = getViewComponent();

  return (
    <div className='wrapper document-list-wrapper'>
      {exportStatus.status === documentConstants.EXPORT_STATUSES.RUNNING && (
        <div className='export-status-container'>{exportDocumentStatusContainer()}</div>
      )}
      <Header
        showMyTasks={showMyTasks}
        actionRequired={actionRequired && actionRequired.length}
        count={totalCount}
        view={view}
        setView={setView}
        setCurrentPage={setCurrentPage}
        onDateChange={onDateChange}
        setReload={setReload}
        viewType={viewType}
        setViewType={setViewType}
        invoiceCount={invoiceCount}
        spNumberQuery={spNumberQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        currentUser={currentUser}
        spNumbers={spList}
        expandedRows={expandedRows}
        setExpandedRows={setExpandedRows}
        sort={sort}
        order={order}
        currentPage={currentPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
      <BulkActionBar
        selectedItemIds={selected}
        setSelectedItemIds={setSelected}
        setAllSelected={setAllSelected}
        setReload={setReload}
        currentUser={currentUser}
        documents={items}
        setViewType={setViewType}
        viewType={viewType}
      />
      <div className='dms-scroll-wrapper'>
        <SortOptions
          visible={view === 'list' && items.length > 0}
          perPage={perPage}
          setPerPage={setPerPage}
          setCurrentPage={setCurrentPage}
          viewType={viewType}
          allSelected={allSelected}
          setAllSelected={selectAllDocument}
        />
        <ViewComponent
          items={items}
          count={totalCount}
          selected={selected}
          setSelected={selectFile}
          perPage={perPage}
          setPerPage={setPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchItems={searchDocuments}
          setReload={setReload}
          favorites={stateMeta.favorites}
          actionRequired={actionRequired}
          unseenDocuments={unseenDocuments}
          viewType={viewType}
          expandedRows={expandedRows}
          loading={stateLoading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

Documents.getInitialProps = async ({ store, query }) => {
  return {
    query
  };
};

Documents.getLayout = (page) => (
  <Layout customSeo={documentConstants.INDEX_SEO} headerClassName='mw-100'>
    {page}
  </Layout>
);

export default Documents;
