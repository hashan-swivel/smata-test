import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import { Link } from '../Link';
import { setModalType } from '../../../actions/buildingProfile';
import { jobConstants } from '../../../constants';
import './WorkHistory.module.scss';

export const WorkHistory = ({ location, recentJobs }) => {
  const [showContent, setShowContent] = useState(true);
  const [completedRecentJobs, setCompletedRecentJobs] = useState([]);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  /**
   * Filter out the completed jobs
   */
  useEffect(() => {
    if (!recentJobs) return;

    setCompletedRecentJobs(recentJobs.filter((job) => job.status === 'completed'));
  }, [recentJobs]);

  if (recentJobs) {
    return (
      <div className='building-recent-work-container'>
        <div className='work-documents-header building-title-margin'>
          <div className='mobile-view-header'>
            <h3 className='building-title-heading h3'>Recent Work History</h3>
          </div>
          <div className='work-history-buttons-container'>
            {recentJobs.length ? (
              <button
                type='button'
                className='button secondary'
                onClick={() => {
                  dispatch(setModalType({ name: 'recent-work' }));
                }}
              >
                View All
              </button>
            ) : null}
          </div>
        </div>

        {completedRecentJobs.length ? (
          completedRecentJobs.slice(0, 5).map((job) => (
            <Link
              href={`${currentUser?.baseUrl}/jobs/${job.job_reference_id}?access_token=${job.access_token}`}
              target='_self'
              key={job.id}
              classNameProp={`work-history-content-grid a ${showContent ? 'active' : 'inactive'}`}
            >
              <div className='icon-container'>
                <span className='icon icon-work-dark work-icon' />
                <span className='work-green-line' />
              </div>
              <div className='work-text'>
                <div className='job-container'>
                  <div className='subtitle'>{job.title}</div>
                  <div className='job-date'>
                    {jobConstants.STATUSES[job.status]}:{' '}
                    {moment.unix(job.updated_at).format('Do MMM YYYY')}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className='work-history-placeholder'>Nothing to display</div>
        )}
      </div>
    );
  }
  return null;
};
