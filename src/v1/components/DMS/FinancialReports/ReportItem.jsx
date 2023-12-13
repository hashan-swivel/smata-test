import React from 'react';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faFileExcel, faFileUpload } from '@fortawesome/free-solid-svg-icons';

import './ReportItem.module.scss';

const ReportItem = ({ crystalReport }) => {
  const openFileIcon = () => {
    const { status } = crystalReport;
    if (status === 'completed') {
      return (
        <a
          href={crystalReport.file_url}
          target='_blank'
          rel='noopener noreferrer'
          className='crystal-report-item-col download-btn'
          title='Completed'
        >
          <FontAwesomeIcon icon={faFileDownload} size='4x' color='#00A344' />
        </a>
      );
    }
    if (status === 'initiated' || status === 'scheduled' || status === 'in-progress') {
      return (
        <div className='crystal-report-item-col download-btn' title='Generating'>
          <FontAwesomeIcon icon={faFileUpload} size='4x' color='#D07C40' />
        </div>
      );
    }
    if (status === 'error') {
      return (
        <div className='crystal-report-item-col download-btn' title='Failed'>
          <FontAwesomeIcon icon={faFileExcel} size='4x' color='#B53629' />
        </div>
      );
    }
  };

  return (
    <div className='crystal-report-item'>
      <div className='crystal-report-item-col details'>
        <div className='created-date'>
          <strong>Created Date: &nbsp;</strong>
          <span>{moment.unix(crystalReport.created_at).format('DD-MM-YYYY')}</span>
        </div>
        <div className='selected-date'>
          <strong>At this date: &nbsp;</strong>
          <span>{moment(crystalReport.request_period).format('DD-MM-YYYY')}</span>
        </div>
        <div className='sp-numbers'>
          <strong>Plan Number(s): &nbsp;</strong>
          <span>{crystalReport.site_plan_ids.join(', ')}</span>
          {crystalReport.lots && crystalReport.lots.length !== 0 && (
            <>
              <strong>&nbsp; |&nbsp; Lot: &nbsp;</strong>
              <span>{crystalReport.lots[0]}</span>
            </>
          )}
        </div>
        <div className='report-types'>
          <strong>Report Type(s): &nbsp;</strong>
          <span>{crystalReport.report_titles.join(', ')}</span>
        </div>
      </div>
      {openFileIcon()}
    </div>
  );
};

export default ReportItem;
