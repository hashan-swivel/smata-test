import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as moment from 'moment';
import './RecentWorkModal.module.scss';
import './JobFilters.module.scss';
import { Link } from '../Link';
import { jobConstants } from '../../../constants';

export const RecentWorkModal = ({ getJobs, isLoading, showLoadMoreButton, jobs, currentPage }) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchByTitle, setSearchByTitle] = useState('');
  const [searchByStatus, setSearchByStatus] = useState('completed');
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (searchByStatus !== 'all') {
      setFilteredJobs(jobs.filter((job) => job.status === searchByStatus));
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    let result = jobs;
    if (searchByTitle && searchByTitle !== '') {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(searchByTitle.toLowerCase())
      );
    }
    setFilteredJobs(result);
  }, [searchByTitle]);

  useEffect(() => {
    getJobs({ moreJob: true, page: 1, recent_job_status: searchByStatus });
  }, [searchByStatus]);

  const handleOnSearchByTitle = (event) => {
    setSearchByTitle(event.target.value);
  };

  const handleOnSearchByStatus = (event) => {
    setSearchByTitle('');
    setSearchByStatus(event.target.value);
  };

  return (
    <div className='recent-work-modal-container'>
      <h3 className='recent-work-modal-title'>All Recent Work</h3>

      <div className='job-filter-inputs'>
        <div className='job-name-filter'>
          <label htmlFor='name'>Job Name</label>
          <input
            type='text'
            placeholder='Search by job title'
            onChange={handleOnSearchByTitle}
            value={searchByTitle}
          />
        </div>
        <div className='job-status-filter'>
          <label htmlFor='name'>Status</label>
          <select onChange={handleOnSearchByStatus} defaultValue={searchByStatus}>
            <option value='all'>All</option>
            {Object.keys(jobConstants.STATUSES).map((key) => (
              <option value={key} key={key}>
                {jobConstants.STATUSES[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='recent-work-list-container'>
        {filteredJobs.length >= 1 ? (
          <>
            {filteredJobs.map((job, index) => (
              <Link
                href={`${currentUser?.baseUrl}/jobs/${job.job_reference_id}?access_token=${job.access_token}`}
                target='_self'
                key={`${job.id}`}
                classNameProp='work-history-content-grid'
              >
                <div className='icon-container'>
                  <span className='icon icon-work-dark work-icon' />
                  <span className='work-green-line' />
                </div>
                <div className='work-text'>
                  <div className='job-container'>
                    <div className='subtitle'>{job.title}</div>
                    <div className='job-date'>
                      <span className='job-status'>{jobConstants.STATUSES[job.status]}</span>:{' '}
                      {moment.unix(job.updated_at).format('Do MMM YYYY')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {showLoadMoreButton && (
              <button
                type='button'
                className='button secondary notice-modal-back-button'
                disabled={isLoading}
                onClick={() =>
                  getJobs({ moreJob: true, page: currentPage, recent_job_status: searchByStatus })
                }
              >
                {isLoading ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        ) : (
          <div>Nothing to display</div>
        )}
      </div>
    </div>
  );
};
