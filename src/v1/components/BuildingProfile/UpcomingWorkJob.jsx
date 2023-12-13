import React, { useState } from 'react';
import * as moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHardHat } from '@fortawesome/free-solid-svg-icons';
import { Link } from '../Link';

import './UpcomingWorkJob.module.scss';

export default function UpcomingWorkJob({ job, jobLink }) {
  const [showFullContractorAndStatusList, setShowFullContractorAndStatusList] = useState(false);

  let contractorAndStatusList;

  if (showFullContractorAndStatusList) {
    contractorAndStatusList = job.job_trade_contractor_statuses;
  } else {
    contractorAndStatusList = job.job_trade_contractor_statuses.slice(0, 3);
  }

  return (
    <div key={job.id} className='upcoming-work-single-item-container' role='presentation'>
      <div className='avatar-title-container upcoming-work'>
        <Link href={jobLink} title={job.title} target='_self' classNameProp='default--link-dark'>
          <strong>{job.title}</strong>
        </Link>
      </div>
      <div className='date-status-container upcoming-work'>
        {contractorAndStatusList.map((jtc) => (
          <div key={jtc.id}>
            <div className='contractor-and-status badge badge--primary'>
              <FontAwesomeIcon icon={faHardHat} />
              &nbsp;{jtc.contractor_name} - {jtc.status}
            </div>
            <br />
          </div>
        ))}
        {job.job_trade_contractor_statuses.length > 3 && (
          <button
            type='button'
            tabIndex={0}
            className='contractor-and-status-show-more'
            onClick={() => {
              setShowFullContractorAndStatusList(!showFullContractorAndStatusList);
            }}
          >
            {showFullContractorAndStatusList ? '- show less' : '+ show more'}
          </button>
        )}
      </div>
      <div className='work-description upcoming-work'>{job.description}</div>
      <div className='work-contractor upcoming-work' style={{ fontSize: '.8rem' }}>
        <strong>Posted:</strong>
        &nbsp;
        {moment.unix(job.created_at).format('lll')} - <strong>Updated:</strong>
        &nbsp;
        {moment.unix(job.updated_at).format('lll')}
      </div>
    </div>
  );
}
