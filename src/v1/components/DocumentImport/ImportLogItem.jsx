import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faExclamationTriangle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { documentImportActions } from '../../../actions';

const importLogStatusIndicator = (logStatus, failedCount) => {
  switch (logStatus) {
    case 'failed':
    case 'cancelled':
      return (
        <FontAwesomeIcon
          className='import-log-status-indicator'
          title={logStatus}
          icon={faTimesCircle}
          style={{ color: '#D4504B' }}
          size='lg'
        />
      );
    case 'completed':
      if (failedCount === 0) {
        return (
          <FontAwesomeIcon
            className='import-log-status-indicator'
            title='All Successful'
            icon={faCheck}
            style={{ color: '#4FCBB2' }}
            size='lg'
          />
        );
      }
      return (
        <FontAwesomeIcon
          className='import-log-status-indicator'
          title='Completed with failed items'
          icon={faExclamationTriangle}
          style={{ color: '#D4504B' }}
          size='lg'
        />
      );
    default:
      return <FontAwesomeIcon className='import-log-status-indicator' icon={faCircle} size='lg' />;
  }
};

export const ImportLogItem = (props) => {
  const {
    id,
    sp_number: spNumber,
    imported_count: importedCount,
    transferred_count: transferredCount,
    total_count: totalCount,
    failed_imported_count: failedCount,
    downloaded_count: downloadedCount,
    status,
    importLogItems,
    dispatch
  } = props;
  const logItemDetails = importLogItems.find((item) => item.id === id);
  const logItemList = logItemDetails?.logItems || [];
  const logItemPage = logItemDetails?.page || 1;
  const logItemTotalPage = logItemDetails?.totalPage || 1;

  const [loadDetails, setLoadDetails] = useState(false);

  const handleGetLogItemDetails = async () => {
    setLoadDetails(true);
    if (logItemList?.length === 0) {
      await dispatch(documentImportActions.getLogItems(id));
    } else {
      await dispatch(documentImportActions.clearLogItems(id));
    }
    setLoadDetails(false);
  };

  const handleGetPaginatedLogItemDetails = async (page = 1) => {
    setLoadDetails(true);
    await dispatch(documentImportActions.getLogItems(id, page));
    setLoadDetails(false);
  };

  const importStats = () => {
    return (
      <h4>
        {transferredCount || 0} transferred / {importedCount || 0} imported / {totalCount}
      </h4>
    );
  };

  return (
    <div className='import-log-entity'>
      <div className='import-log-status'>
        {importLogStatusIndicator(status, failedCount)}
        <h4 style={{ textTransform: 'capitalize', color: '#999' }}>{spNumber}:</h4>
        &nbsp;
        {importStats()}
      </div>
      {(importedCount > 0 || failedCount > 0) && (
        <div className='import-log-status-details'>
          {failedCount > 0 && <h5 style={{ color: '#D4504B' }}>Failed: {failedCount}</h5>}
          {logItemList?.length > 0 && (
            <ul style={{ listStyle: 'disc', marginLeft: '1em' }}>
              {logItemList.map((logItem) => (
                <li
                  key={logItem.id}
                  className={`${logItem?.status === 'failed' ? 'text--danger' : ''}`}
                >
                  <h5 style={{ textTransform: 'capitalize' }}>{logItem.message}</h5>
                </li>
              ))}
            </ul>
          )}

          <div className='action-buttons' style={{ marginTop: '.5em' }}>
            <button
              type='button'
              className='button button--primary'
              style={{ lineHeight: 'normal' }}
              onClick={handleGetLogItemDetails}
              disabled={loadDetails}
            >
              Details
            </button>
            {logItemList?.length > 0 && failedCount > 1 && (
              <>
                <button
                  type='button'
                  className='button button--secondary'
                  style={{ marginLeft: '1.5em', lineHeight: 'normal' }}
                  onClick={() => handleGetPaginatedLogItemDetails(logItemPage - 1)}
                  disabled={loadDetails || logItemPage === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} style={{ color: 'white' }} />
                  &nbsp; PREV
                </button>
                <button
                  type='button'
                  className='button button--secondary'
                  style={{ marginLeft: '.5em', lineHeight: 'normal' }}
                  onClick={() => handleGetPaginatedLogItemDetails(logItemPage + 1)}
                  disabled={loadDetails || logItemPage === logItemTotalPage}
                >
                  NEXT &nbsp;
                  <FontAwesomeIcon icon={faChevronRight} style={{ color: 'white' }} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
