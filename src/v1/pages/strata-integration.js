import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  faCheckCircle,
  faPlug,
  faCog,
  faDownload,
  faPause,
  faPlay,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout, Loading } from '@/components/v1';
import { modalActions, strataIntegrationActions } from '@/actions';
import { strataMasterIntegrationConstants } from '@/constants';
import ProgressBar from '@/components/v1/ProgressBar';
import { ImportLogItem } from '@/components/v1/StrataIntegration';

import './strata-integration.module.scss';
import BuildingProfile from './building-profile';
import Error from './_error';

const StrataIntegration = () => {
  const dispatch = useDispatch();
  const strataIntegration = useSelector((state) => state.strataIntegration);
  const user = useSelector((state) => state.auth.currentUser);
  const { loading, connectionStatus, dataImportLogId, importLogs, importStatus, wizardUrl } =
    strataIntegration;
  const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);
  const [disabledImportBtn, setDisabledImportBtn] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (user.organisation_id && !connectionStatus) {
      dispatch(strataIntegrationActions.getConnectionStatus(user.organisation_id));
    }
  }, [user]);

  useEffect(() => {
    if (user.organisation_id && connectionStatus === 'connection_established') {
      dispatch(strataIntegrationActions.getWizardUrl(user.organisation_id));

      if (user.data_import_id) {
        dispatch(strataIntegrationActions.updateDataImportLogId(user.data_import_id));
      }
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    if (dataImportLogId) {
      if (importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.IN_PROGRESS) {
        timeoutRef.current = setTimeout(() => {
          dispatch(strataIntegrationActions.getImportLogs(dataImportLogId));
        }, 4000);
      } else if (importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.NEW) {
        timeoutRef.current = setTimeout(() => {
          dispatch(strataIntegrationActions.getImportLogs(dataImportLogId));
        }, 1000);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [importLogs]);

  useEffect(() => {
    if (dataImportLogId) dispatch(strataIntegrationActions.getImportLogs(dataImportLogId));
  }, [dataImportLogId]);

  const onCreateIntegrationApiKeyClick = () => {
    setIsCreatingApiKey(true);
    dispatch(strataIntegrationActions.createApiKey(user.organisation_id));
  };

  const importStatusContainer = () => {
    const sumImportedCount = importLogs
      .map((item) => item.imported_count)
      .reduce((prev, next) => prev + next, 0);
    const sumTotalCount = importLogs
      .map((item) => item.total_count)
      .reduce((prev, next) => prev + next, 0);
    const progressPercentage =
      sumTotalCount === 0 ? 0 : parseInt((sumImportedCount / sumTotalCount) * 100, 10);

    return (
      <>
        <ProgressBar completed={progressPercentage} labelStyles={{ fontSize: '0.9em' }} />
        {importControls()}
        {importLogList()}
      </>
    );
  };

  const importControls = () => {
    if (importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.COMPLETED) return null;

    return (
      <div className='import-log__controls'>
        <button
          type='button'
          className='button button--danger'
          disabled={importStatus !== strataMasterIntegrationConstants.IMPORT_STATUSES.IN_PROGRESS}
          onClick={() => dispatch(strataIntegrationActions.stopImporting(dataImportLogId))}
        >
          <div className='button__icon'>
            <FontAwesomeIcon icon={faPause} />
          </div>
          <div className='button__text'>Stop</div>
        </button>
        <button
          type='button'
          className='button button--primary'
          disabled={importStatus !== strataMasterIntegrationConstants.IMPORT_STATUSES.STOPPED}
          onClick={() => dispatch(strataIntegrationActions.restartImporting(dataImportLogId))}
        >
          <div className='button__icon'>
            <FontAwesomeIcon icon={faPlay} />
          </div>
          <div className='button__text'>Resume</div>
        </button>
      </div>
    );
  };

  const importLogList = () => (
    <div className='import-log-list'>
      {importLogs.map((importLog) => (
        <ImportLogItem
          key={importLog.id}
          {...importLog}
          importStatus={importStatus}
          dataImportLogId={dataImportLogId}
        />
      ))}
    </div>
  );

  const connectionEstablishedRender = () => (
    <div className='connection-established-container'>
      {(importStatus === undefined ||
        importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.NEW) && (
        <>
          <h3 className='connection-established-title'>STRATA MASTER API KEY OBTAINED</h3>
          <div className='actions-container'>
            <button
              type='button'
              className='button primary toggle-wizard-modal-btn'
              disabled={!wizardUrl}
              onClick={() => {
                setDisabledImportBtn(false);
                dispatch(
                  modalActions.showModal('STRATA_MASTER_API_WIZARD', {
                    wizardUrl
                  })
                );
              }}
            >
              <div className='button__icon'>
                <FontAwesomeIcon icon={faCog} />
              </div>
              <div className='button__text'>{wizardUrl ? 'Wizard Settings' : 'Loading...'}</div>
            </button>
            <button
              type='button'
              className='button primary import-data-btn'
              disabled={disabledImportBtn}
              onClick={() => {
                setDisabledImportBtn(true);
                dispatch(strataIntegrationActions.createImportLogs(user.organisation_id));
              }}
            >
              <div className='button__icon'>
                <FontAwesomeIcon icon={faDownload} />
              </div>
              <div className='button__text'>Import</div>
            </button>
          </div>
        </>
      )}

      {importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.IN_PROGRESS && (
        <>
          <h3 className='import__title--pending'>
            <FontAwesomeIcon icon={faDownload} size='lg' />
            &nbsp;&nbsp; IMPORTING ...
          </h3>
          <div className='import-status-container'>{importStatusContainer()}</div>
        </>
      )}

      {importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.STOPPED && (
        <>
          <h3 className='import__title--stopped'>
            <FontAwesomeIcon icon={faDownload} size='lg' />
            &nbsp;&nbsp; STOPPED
          </h3>
          <div className='import-status-container'>{importStatusContainer()}</div>
        </>
      )}

      {importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.FAILED && (
        <>
          <h3 className='import__title--failed'>
            <FontAwesomeIcon icon={faDownload} size='lg' />
            &nbsp;&nbsp; FAILED
          </h3>
          <div className='import-status-container'>{importStatusContainer()}</div>
        </>
      )}

      {importStatus === strataMasterIntegrationConstants.IMPORT_STATUSES.COMPLETED && (
        <>
          <h3 className='import-completed-title'>
            <FontAwesomeIcon icon={faCheckCircle} size='2x' />
            &nbsp;&nbsp; IMPORT COMPLETED
          </h3>
          <div className='import-status-container'>{importLogList()}</div>
        </>
      )}
    </div>
  );

  const noConnectionRender = () => (
    <div className='no-connection-container'>
      <h3 className='no-connection-title'>STRATA MASTER API KEY NOT FOUND</h3>
      <div className='actions-container'>
        <button
          type='button'
          onClick={() => onCreateIntegrationApiKeyClick()}
          className='button primary get-api-key-btn'
          disabled={isCreatingApiKey}
        >
          <div className='button__icon'>
            <FontAwesomeIcon icon={faPlug} />
          </div>
          <div className='button__text'>
            {isCreatingApiKey ? 'Requesting...' : 'Request Strata Api Key'}
          </div>
        </button>
      </div>
    </div>
  );

  const statusRender = () => {
    switch (connectionStatus) {
      case 'connection_established':
        return connectionEstablishedRender();
      case 'no_connection':
        return noConnectionRender();
      default:
        return null;
    }
  };

  return (
    <div className='wrapper mw-100' id='strata-integration-page-container'>
      <h3 className='account-settings-title'>Strata Master Integration</h3>
      <div id='strata-integration-container'>{loading ? <Loading /> : statusRender()}</div>
    </div>
  );
};

StrataIntegration.getLayout = (page) => <Layout headerClassName='mw-100'>{page}</Layout>;

export default StrataIntegration;
