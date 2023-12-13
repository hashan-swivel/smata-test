import React from 'react';
import Moment from 'moment';
import './SingleJobView.module.scss';

export const SingleJobView = (props) => {
  const { openJob, setOpenJob, singleJob, allJobs } = props;

  const images = [
    'https://d1pra95f92lrn3.cloudfront.net/media/thumb/8404_fit512.jpg',
    'https://d1pra95f92lrn3.cloudfront.net/media/thumb/8404_fit512.jpg',
    'https://d1pra95f92lrn3.cloudfront.net/media/thumb/8404_fit512.jpg'
  ];
  return (
    <div className={`single-job-container ${openJob ? 'active' : 'inactive'}`}>
      <h4 className='single-job-title'>{singleJob.title}</h4>

      <div className='single-job-address'>
        <strong> {singleJob.location_name} </strong>
      </div>

      <div className='single-job-strata-manager-name'>
        <strong>Strata Manager:</strong> {singleJob.strata_manager_name}
      </div>

      <div className='single-job-contractor'>
        <strong>Contractor:</strong> {allJobs[0].job_trade.contractors[0].name}
      </div>

      <div className='single-job-reference'>
        <strong>Job reference:</strong> {singleJob.job_reference_id}
      </div>
      <div className='single-job-description'>
        <strong>Description:</strong> {singleJob.description}
      </div>
      <h4 className='single-job-subtitle'>Images</h4>
      <div className='job-images-container'>
        {images &&
          images.length > 4 &&
          images.slice(0, 4).map((image) => <img src={image} alt='key' className='job-image' />)}
        {images &&
          images.length <= 4 &&
          images.map((image) => <img src={image} alt='key' className='job-image' />)}
      </div>
      {singleJob.history ? (
        <div className='job-history-container'>
          <h4>Job history</h4>
          <div className='all-history-container'>
            {singleJob.history.map((history) => (
              <div key={history.id} className='single-history-item-container'>
                <div className='history-date-description-container'>
                  <div className='history-date-description'>
                    <span className='history-date'>
                      {Moment.unix(history.created_at).format('DD/MM/YYYY')}-{' '}
                    </span>
                    <span className='history-description'>{history.description}</span>
                  </div>
                  {/* <div className="work-green-line" /> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <button
        type='button'
        onClick={() => setOpenJob(false)}
        className='button secondary job-history-back-button'
      >
        Back
      </button>
    </div>
  );
};
