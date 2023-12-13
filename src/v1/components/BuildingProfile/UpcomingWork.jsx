import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AliceCarousel from 'react-alice-carousel';

import { modalActions } from '../../../actions';
import UpcomingWorkJob from './UpcomingWorkJob';

import './UpcomingWork.module.scss';
import 'react-alice-carousel/lib/alice-carousel.css';

// Set how many upcoming work items to display per page depending on screen width
const responsive = {
  0: { items: 1 },
  660: { items: 2 },
  1024: { items: 3 }
};

export const UpcomingWork = ({ upcomingWorks, jobId, buildingProfile }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const currentJob = upcomingWorks.find((work) => work.id === parseInt(jobId, 10));
    if (currentJob) {
      window.location.href = jobLink(currentJob);
    }
  }, [jobId]);

  const jobLink = (job) => {
    const nameSpace = currentUser?.namespace;
    if (nameSpace) {
      return `${currentUser?.baseUrl}/${nameSpace}/jobs/${job.id}`;
    }

    return `${currentUser?.baseUrl}/jobs/${job.job_reference_id}?access_token=${job.access_token}`;
  };

  if (upcomingWorks && upcomingWorks.length > 0) {
    return (
      <div className='upcoming-work-container'>
        <div className='upcoming-work-header building-title-margin'>
          <div className='mobile-view-header'>
            <h3 className='building-title-heading h3'>Upcoming Work</h3>
          </div>
          <div className='calendar-buttons-container'>
            <button
              type='button'
              className='button secondary'
              onClick={() => {
                dispatch(modalActions.showModal('UPCOMING_WORK_MODAL', { buildingProfile }));
              }}
            >
              View All
            </button>
          </div>
        </div>
        <div className='upcoming-work-items-container active'>
          {upcomingWorks.length === 0 && <div> No upcoming jobs </div>}
          {upcomingWorks.length >= 3 ? (
            <AliceCarousel
              mouseTrackingEnabled
              preventEventOnTouchMove
              responsive={responsive}
              dotsDisabled
              infinite
              autoPlay={upcomingWorks.length > 3}
              autoPlayInterval={7000}
              items={upcomingWorks.map((job) => (
                <UpcomingWorkJob job={job} jobLink={jobLink(job)} key={job.id} />
              ))}
              // probably should pause on hover and increase the autoplay interval
            />
          ) : (
            <div className='upcoming-work-items-container not-carousel active'>
              {upcomingWorks.map((job) => (
                <UpcomingWorkJob job={job} jobLink={jobLink(job)} key={job.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
