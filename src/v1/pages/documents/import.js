import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Layout } from '@/components/v1';
import { documentImportActions } from '@/actions';
import { DocumentImportForm } from '@/components/v1/DocumentImport/DocumentImportForm';
import { Progress } from '@/components/v1/DocumentImport/Progress';

import './import.module.scss';

const Import = ({ dispatch, loading, importLogs, importStatus, importLogItems }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (currentUser.organisation_id && importStatus === undefined) {
      dispatch(documentImportActions.getImportStatus());
    }
  }, [currentUser]);

  const statusRender = () => {
    switch (importStatus) {
      case 'not_started':
        return <DocumentImportForm />;
      case 'started':
        return (
          <Progress
            importLogs={importLogs}
            importLogItems={importLogItems}
            dispatch={dispatch}
            importStatus={importStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='wrapper mw-100' id='strata-integration-page-container'>
      <h3 className='account-settings-title pb-0'>Import Documents from SFTP</h3>
      <p>
        For complete instructions, please refer to the{' '}
        <a
          href='https://docs.google.com/document/d/1IyF5_rqKVRsxChOF6bOhFUfiJBvPRzbF/edit'
          className='default--link'
          target='_blank'
          rel='noopener noreferrer'
        >
          SFTP Document Upload Guide
        </a>
      </p>
      <div id='strata-integration-container'>{statusRender()}</div>
    </div>
  );
};

Import.getLayout = (page) => <Layout headerClassName='mw-100'>{page}</Layout>;

export default connect((state) => state.documentImport)(Import);
