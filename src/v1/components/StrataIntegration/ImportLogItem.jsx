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
import { useDispatch, useSelector } from 'react-redux';
import { strataIntegrationActions } from '../../../actions';
import { strataMasterIntegrationConstants } from '../../../constants';

// TODO: Move to back-end
const importLogName = (name) => {
  switch (name) {
    case 'strata_managers':
      return 'Users';
    case 'contractors':
      return 'Creditors';
    case 'lot_contacts':
      return 'Contacts';
    case 'preferred_tradesman':
      return 'Preferred Creditors';
    case 'building_details':
      return 'Building Information';
    case 'tradesman_bpay':
      return 'Creditor CRNs';
    default:
      if (name) {
        return `${name.replace(/_/g, ' ')}`;
      } else {
        return 'NA';
      }
  }
};

const importLogStatusIndicator = (logStatus, failedCount) => {
  switch (logStatus) {
    case 'failed':
      return (
        <FontAwesomeIcon
          className='import-log-status-indicator'
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
            icon={faCheck}
            style={{ color: '#4FCBB2' }}
            size='lg'
          />
        );
      }
      return (
        <FontAwesomeIcon
          className='import-log-status-indicator'
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
    name,
    imported_count: importedCount,
    total_count: totalCount,
    failed_count: failedCount,
    downloaded_count: downloadedCount,
    status,
    importStatus,
    dataImportLogId
  } = props;
  const failedItemDetails = useSelector((state) =>
    state.strataIntegration.importLogFailedItems.find((item) => item.id === id)
  );
  const failedItems = failedItemDetails?.failedItems || [];
  const failedItemsPage = failedItemDetails?.page || 1;
  const failedItemsTotalPage = failedItemDetails?.totalPage || 1;

  const [loadDetails, setLoadDetails] = useState(false);
  const dispatch = useDispatch();

  const handleReimportFailedItem = () => {
    if (dataImportLogId) {
      dispatch(strataIntegrationActions.reimportFailedItems(id, dataImportLogId));
    }
  };

  const handleGetFailedItemDetails = async () => {
    setLoadDetails(true);
    if (failedItems?.length === 0) {
      await dispatch(strataIntegrationActions.getFailedItemDetails(id));
    } else {
      await dispatch(strataIntegrationActions.clearFailedItemDetails(id));
    }
    setLoadDetails(false);
  };

  const handleGetPaginatedFailedItemDetails = async (page = 1) => {
    setLoadDetails(true);
    await dispatch(strataIntegrationActions.getFailedItemDetails(id, page));
    setLoadDetails(false);
  };

  const importStats = () => {
    if (status === 'downloading') {
      return (
        <h4>
          {downloadedCount} downloaded / {totalCount}
        </h4>
      );
    }

    return (
      <h4>
        {importedCount || 0} imported / {totalCount}
      </h4>
    );
  };

  return (
    <div className='import-log-entity'>
      <div className='import-log-status'>
        {importLogStatusIndicator(status, failedCount)}
        <h4 style={{ textTransform: 'capitalize', color: '#999' }}>{name}:</h4>
        &nbsp;
        {importStats()}
      </div>
      {failedCount > 0 && (
        <div className='import-log-status-details'>
          {failedItems?.length > 0 ? (
            <ul style={{ listStyle: 'disc', marginLeft: '1em' }}>
              {failedItems.map((failedItem) => (
                <li key={failedItem.id} style={{ color: '#D4504B' }}>
                  <h5 style={{ textTransform: 'capitalize' }}>
                    {name} {failedItem.external_id}: {failedItem.description}
                  </h5>
                </li>
              ))}
            </ul>
          ) : (
            <h5 style={{ color: '#D4504B' }}>Failed: {failedCount}</h5>
          )}

          <div className='action-buttons' style={{ marginTop: '.5em' }}>
            <button
              type='button'
              className='button button--primary'
              style={{ lineHeight: 'normal' }}
              onClick={handleGetFailedItemDetails}
              disabled={loadDetails}
            >
              Details
            </button>
            {status === 'completed' && (
              <button
                type='button'
                className='button button--primary'
                style={{ marginLeft: '.5em', lineHeight: 'normal' }}
                onClick={handleReimportFailedItem}
                disabled={
                  importStatus !== strataMasterIntegrationConstants.IMPORT_STATUSES.COMPLETED
                }
                title='Available when all items finished'
              >
                Re-import
              </button>
            )}
            {failedItems?.length > 0 && failedCount > 50 && (
              <>
                <button
                  type='button'
                  className='button button--secondary'
                  style={{ marginLeft: '1.5em', lineHeight: 'normal' }}
                  onClick={() => handleGetPaginatedFailedItemDetails(failedItemsPage - 1)}
                  disabled={loadDetails || failedItemsPage === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} style={{ color: 'white' }} />
                  &nbsp; PREV
                </button>
                <button
                  type='button'
                  className='button button--secondary'
                  style={{ marginLeft: '.5em', lineHeight: 'normal' }}
                  onClick={() => handleGetPaginatedFailedItemDetails(failedItemsPage + 1)}
                  disabled={loadDetails || failedItemsPage === failedItemsTotalPage}
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
