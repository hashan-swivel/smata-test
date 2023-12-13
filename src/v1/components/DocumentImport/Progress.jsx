import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDownload, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ImportLogItem } from './ImportLogItem';
import ProgressBar from '../ProgressBar';
import { documentImportConstants } from '../../../constants';
import { axiosInstance } from '../../../utils';
import { documentImportActions, flashActions } from '../../../actions';

import '@/pages/documents/import.module.scss';

export const Progress=( { dispatch, importStatus, importLogs, importLogItems } ) =>
{
  const [ cancelling, setCancelling ]=useState( false );
  const allCompletedOrCancelled=importLogs.every(
    ( v ) => v.status==='completed'||v.status==='cancelled'
  );
  const timeoutRef=useRef( null );

  useEffect( () =>
  {
    if ( timeoutRef.current!==null ) clearTimeout( timeoutRef.current );

    if ( importStatus==='started'&&!allCompletedOrCancelled )
    {
      timeoutRef.current=setTimeout( () =>
      {
        dispatch( documentImportActions.getImportStatus() );
      }, 4000 );
    }

    return () => clearTimeout( timeoutRef.current );
  }, [ importLogs ] );

  const importStatusContainer=() =>
  {
    const sumImportedCount=importLogs
      .map( ( item ) => item.imported_count )
      .reduce( ( prev, next ) => prev+next, 0 );
    const sumTotalCount=importLogs
      .map( ( item ) => item.total_count )
      .reduce( ( prev, next ) => prev+next, 0 );
    const progressPercentage=
      sumTotalCount===0? 0:parseInt( ( sumImportedCount/sumTotalCount )*100, 10 );

    return (
      <>
        { allCompletedOrCancelled? (
          <>
            <h3 className='import__title--pending'>
              <FontAwesomeIcon icon={ faCheckCircle } size='lg' />
              &nbsp;&nbsp; IMPORT COMPLETED
            </h3>
            <div className='import-status-container'>
              <div className='import-log__controls'>
                <button
                  type='button'
                  className='button button--primary'
                  onClick={ () => backToImportView() }
                >
                  <div className='button__icon'>
                    <FontAwesomeIcon icon={ faPlus } />
                  </div>
                  <div className='button__text'>New Import</div>
                </button>
              </div>
              { importLogList() }
            </div>
          </>
        ):(
          <>
            <h3 className='import__title--pending'>
              <FontAwesomeIcon icon={ faDownload } size='lg' />
              &nbsp;&nbsp; IMPORTING ...
            </h3>
            <div className='import-status-container'>
              <ProgressBar completed={ progressPercentage } labelStyles={ { fontSize: '0.9em' } } />
              <div className='import-log__controls'>
                <button
                  type='button'
                  className='button button--danger'
                  disabled={ cancelling }
                  onClick={ () => handleCancelClicked() }
                >
                  <div className='button__icon'>
                    <FontAwesomeIcon icon={ faTimes } />
                  </div>
                  <div className='button__text'>Cancel</div>
                </button>
              </div>
              { importLogList() }
            </div>
          </>
        ) }
      </>
    );
  };

  const handleCancelClicked=async () =>
  {
    setCancelling( true );
    await axiosInstance
      .put( `${documentImportConstants.BASE_PATH}/cancel_import` )
      .then( () =>
      {
        setCancelling( false );
        dispatch( flashActions.showSuccess( 'Done!' ) );
        backToImportView();
      } )
      .catch( ( error ) =>
      {
        dispatch( flashActions.showError( error ) );
        setCancelling( false );
      } );
  };

  const backToImportView=() =>
  {
    dispatch( { type: documentImportConstants.SET_IMPORT_STATUS, payload: 'not_started' } );
  };

  const importLogList=() => (
    <div className='import-log-list'>
      { importLogs.map( ( importLog ) => (
        <ImportLogItem
          key={ importLog.id }
          importLogItems={ importLogItems }
          dispatch={ dispatch }
          { ...importLog }
        />
      ) ) }
    </div>
  );

  return <div className='connection-established-container'>{ importStatusContainer() }</div>;
};
