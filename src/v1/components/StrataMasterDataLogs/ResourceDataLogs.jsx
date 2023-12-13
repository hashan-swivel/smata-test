import React, { useState, useEffect } from 'react';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { getStrataMasterDataLogs } from '../../../actions/strataMasterDataLogs';
import { modalActions } from '../../../actions';
import { axiosInstance } from '../../../utils';
import { documentConstants, strataMasterDataLogsConstants } from '../../../constants';
import { flashActions } from '../../../actions/flash';
import { PerPageOptions, PaginationOptions } from '../Pagination';
import { Loading } from '../Loading';

const ResourceLogItem = ({
  currentVersionItem,
  organisationId,
  resource,
  currentPage,
  perPage
}) => {
  const resourceName = resource?.name;
  const useSecondaryId = resource?.use_secondary_id;
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingSyncCompare, setLoadingSyncCompare] = useState(false);
  const [numericVersionItems, setNumericVersionItems] = useState([]);
  const [liveDataFromStrataMaster, setLiveDataFromStrataMaster] = useState();
  const dataColumns = Object.keys(currentVersionItem);

  // set pagination for histories items
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentDataLogItem, setCurrentDataLogItem] = useState();
  const [totalCountHistory, setTotalCountHistory] = useState(0);
  const [currentPageHistory, setCurrentPageHistory] = useState(
    strataMasterDataLogsConstants.INIT_FIRST_PAGE
  );
  const [perPageHistory, setPerPageHistory] = useState(strataMasterDataLogsConstants.INIT_PER_PAGE);

  useEffect(() => {
    if (currentDataLogItem) {
      getDataLogDetails(currentDataLogItem);
    }
  }, [currentPageHistory]);

  const changePageHistory = (pageNumber) => setCurrentPageHistory(pageNumber);

  const handleClickOnVersionItem = (item) => {
    setIsOpen(!isOpen);
    setCurrentDataLogItem(item);
    getDataLogDetails(item);
  };

  const getDataLogDetails = (item) => {
    setLoadingHistory(true);
    let params = {
      organisation_id: organisationId,
      resource_name: resourceName,
      page: currentPageHistory,
      per_page: perPageHistory
    };
    if (useSecondaryId) {
      params = { ...params, secondary_external_id: item?.secondary_external_id };
    }
    axiosInstance
      .get(`v1/strata_master_data_logs/${item.external_id}/data_log_details`, {
        params
      })
      .then((response) => {
        setLoadingHistory(false);
        if (response?.status === 200) {
          const { data_log_details: dataLogDetails, meta: stateMetaLogDetails } = response?.data;
          setNumericVersionItems(dataLogDetails?.filter((i) => i.version !== 'current'));
          setCurrentPageHistory(stateMetaLogDetails?.page);
          setTotalCountHistory(stateMetaLogDetails?.total_count);
          setPerPageHistory(stateMetaLogDetails?.per_page);
        }
      })
      .catch((error) => {
        setLoadingHistory(false);
        dispatch(flashActions.showError(error));
      });
  };

  const getLiveDataFromStrataMaster = (item) => {
    setLoadingSyncCompare(true);
    let params = {
      organisation_id: organisationId,
      resource_name: resourceName
    };
    if (useSecondaryId) {
      params = { ...params, secondary_id: item?.secondary_external_id };
    }
    axiosInstance
      .put(`v1/strata_master_data_logs/${item.external_id}/collect_from_strata_master`, params)
      .then((response) => {
        setLoadingSyncCompare(false);
        setLiveDataFromStrataMaster(response.data);
        dispatch(flashActions.showSuccess('Get live data success'));
      })
      .catch((error) => {
        setLoadingSyncCompare(false);
        dispatch(flashActions.showError(error));
      });
  };

  const handleManualSyncCurrentVersionItem = (item) => {
    setIsOpen(false);
    setLoadingSyncCompare(true);
    dispatch(flashActions.showSuccess('Manually sync triggered'));
    let params = {
      organisation_id: organisationId,
      resource_name: resourceName
    };
    if (useSecondaryId) {
      params = { ...params, secondary_id: item?.secondary_external_id };
    }
    axiosInstance
      .put(`v1/strata_master_data_logs/${item.external_id}/sync_with_strata_master`, params)
      .then((response) => {
        setLoadingSyncCompare(false);
        if (response?.data?.status === 'success') {
          dispatch(flashActions.showSuccess(response?.data?.message));
          dispatch(
            getStrataMasterDataLogs(
              resourceName,
              currentPage,
              perPage,
              organisationId,
              setLoading,
              false,
              true
            )
          );
          dispatch(flashActions.showSuccess('Refreshed Strata Manager Logs'));
        } else {
          dispatch(flashActions.showError(response?.data?.message));
        }
      })
      .catch((error) => {
        setLoadingSyncCompare(false);
        dispatch(flashActions.showError(error));
      });
  };

  function DataColumn(props) {
    const dataValue = props.data[props.column];
    const dateTimeFormat = 'DD/MM/YYYY';
    if (Array.isArray(dataValue))
      return (
        <div
          className='array-column'
          dangerouslySetInnerHTML={{ __html: dataValue.join('<br/>') }}
        />
      );
    if (props.column === 'updated') return moment.unix(dataValue).format(dateTimeFormat);
    if (props.column === 'applies') return moment(dataValue).format(dateTimeFormat);
    return dataValue;
  }

  const renderVersionItemHistories = () => {
    if (loadingHistory) return null;

    return numericVersionItems.map((numericVerion) => (
      <tr>
        <td></td>
        {dataColumns &&
          dataColumns.map((column) => (
            <td>
              <DataColumn column={column} data={numericVerion} />
            </td>
          ))}
        <td></td>
        <td></td>
      </tr>
    ));
  };

  const renderVersionItemPagination = () => (
    <>
      {loadingHistory && <Loading componentLoad />}
      <PaginationOptions
        totalItems={totalCountHistory}
        perPage={perPageHistory}
        changePage={changePageHistory}
        currentPage={currentPageHistory}
      />
    </>
  );

  return (
    <div className='table-wrapper'>
      <table className='table table--default building-detail-item'>
        <thead>
          <tr className='bg-grey'>
            <th></th>
            {dataColumns &&
              dataColumns.map((column) => (
                <th className='capitalize'>{column.replaceAll('_', ' ')}</th>
              ))}
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {liveDataFromStrataMaster && (
            <tr className='bg-light-red'>
              <td></td>
              {dataColumns &&
                dataColumns.map((column) => (
                  <td>
                    <DataColumn column={column} data={liveDataFromStrataMaster} />
                  </td>
                ))}
              <td></td>
              <td></td>
            </tr>
          )}
          <tr>
            <td>
              <a
                href='#'
                className='button primary'
                onClick={() => handleClickOnVersionItem(currentVersionItem)}
              >
                {!isOpen && <FontAwesomeIcon icon={faPlus} />}
                {isOpen && <FontAwesomeIcon icon={faMinus} />}
              </a>
            </td>
            {dataColumns &&
              dataColumns.map((column) => (
                <td>
                  <DataColumn column={column} data={currentVersionItem} />
                </td>
              ))}
            <td>
              <>{loadingSyncCompare && <Loading componentLoad />}</>
            </td>
            <td>
              <button
                type='button'
                className='button primary'
                onClick={() => getLiveDataFromStrataMaster(currentVersionItem)}
              >
                Compare
              </button>
              <button
                type='button'
                className='button primary'
                onClick={() => handleManualSyncCurrentVersionItem(currentVersionItem)}
              >
                Sync
              </button>
            </td>
          </tr>
          <>{isOpen && numericVersionItems && renderVersionItemHistories()}</>
        </tbody>
      </table>
      {isOpen && renderVersionItemPagination()}
    </div>
  );
};

export const ResourceDataLogs = ({ organisationId, setLoading, reload, resource }) => {
  const resourceName = resource?.name;
  const dispatch = useDispatch();
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(strataMasterDataLogsConstants.INIT_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(strataMasterDataLogsConstants.INIT_FIRST_PAGE);
  const stateStrataMasterDataLogs = useSelector((state) => state.strataMasterDataLogs);
  const { resourceDataLogs, meta: stateMeta } = useSelector((state) => state.strataMasterDataLogs);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  function handlePerPageClicked(amount) {
    setCurrentPage(1);
    setPerPage(parseInt(amount, 10));
  }

  useEffect(() => {
    if (organisationId && resourceName) {
      setLoading(true);
      dispatch(
        getStrataMasterDataLogs(
          resourceName,
          currentPage,
          perPage,
          organisationId,
          setLoading,
          false,
          true
        )
      );
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    if (organisationId && resourceName) {
      setLoading(true);
      setCurrentPage(strataMasterDataLogsConstants.INIT_FIRST_PAGE);
      setPerPage(strataMasterDataLogsConstants.INIT_PER_PAGE);
      dispatch(
        getStrataMasterDataLogs(
          resourceName,
          strataMasterDataLogsConstants.INIT_FIRST_PAGE,
          strataMasterDataLogsConstants.INIT_PER_PAGE,
          organisationId,
          setLoading,
          reload,
          false
        )
      );
    }
  }, [organisationId, resourceName]);

  useEffect(() => {
    setTotalCount(stateMeta.total_count);
    setPerPage(stateMeta.per_page);
    setCurrentPage(stateMeta.page || 1);
  }, [stateMeta]);

  const showMissingStrataMasterDataModal = (orgId) => {
    dispatch(
      modalActions.showModal('MISSING_STRATA_MASTER_DATA_MODAL', {
        organisationId: orgId,
        resourceName
      })
    );
  };

  const handleImportMissingData = (orgId) => {
    setLoading(true);
    axiosInstance
      .post('v1/strata_master_data_logs/import_missing_items', {
        organisation_id: orgId,
        resource_name: resourceName
      })
      .then((response) => {
        setLoading(false);
        if (response?.data?.status === 'success') {
          dispatch(flashActions.showSuccess(response?.data?.message));
        } else {
          dispatch(flashActions.showError(response?.data?.message));
        }
      })
      .catch((error) => {
        setLoading(false);
        dispatch(flashActions.showError(error));
      });
  };

  return (
    <>
      {resourceDataLogs && resourceDataLogs.length > 0 && (
        <section className='strata-data-logs-list-items strata-data-logs-list-view'>
          {resourceDataLogs.map((item, index) => (
            <ResourceLogItem
              currentVersionItem={item}
              organisationId={organisationId}
              resource={resource}
              currentPage={currentPage}
              perPage={perPage}
            />
          ))}
          <>
            <button
              type='button'
              className='button primary'
              onClick={() => showMissingStrataMasterDataModal(organisationId)}
            >
              Preview Missing Data
            </button>
            <button
              type='button'
              className='button primary'
              onClick={() => handleImportMissingData(organisationId)}
            >
              Import Missing Data
            </button>
          </>
          <PaginationOptions
            totalItems={totalCount}
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
      )}
    </>
  );
};
