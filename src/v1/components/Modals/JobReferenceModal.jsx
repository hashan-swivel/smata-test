import React, { useState } from 'react';
import { connect } from 'react-redux';
import { autofill } from 'redux-form';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tippy';
import startCase from 'lodash/startCase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { flashActions, modalActions } from '../../../actions';
import { axiosInstance } from '../../../utils';
import ModalContainer from './ModalContainer';

import './JobReferenceModal.module.scss';

const JobReferenceModal = ({ dispatch, spNumber, currentUser, creditorId }) => {
  const { register, handleSubmit } = useForm({});
  const [searchResultItems, setSearchResultItems] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    const params = { q: data.q, sp_number: spNumber, contractor_id: creditorId, per_page: 10 };
    await axiosInstance
      .get('/v1/jobs', { params })
      .then((res) => setSearchResultItems(res?.data?.jobs))
      .catch((error) => flashActions.showError(error));

    setLoading(false);
    setHasSearched(true);
  };

  const onClickLinkJobHandler = (job_trade_id) => {
    dispatch(autofill('invoiceForm', 'invoiceDetails.jobTradeId', job_trade_id));
    dispatch(modalActions.hideModal());
  };

  const renderSearchResults = () => {
    if (searchResultItems.length > 0) {
      return (
        <div className='job-search-results'>
          {searchResultItems.map((job) => (
            <div className='job-search-result' key={job.id}>
              <p className='job-title'>
                <strong>
                  <a href={`${currentUser?.baseUrlWithNameSpace}/jobs/${job.id}`}>
                    #{job.job_reference_id}
                  </a>
                  <span>: {job.title}</span>
                </strong>
              </p>
              <table className='table table--default' key={job.id}>
                <colgroup>
                  <col span='1' style={{ width: '15%' }} />
                  <col span='1' style={{ width: '30%' }} />
                  <col span='1' style={{ width: '50%' }} />
                  <col span='1' style={{ width: '5%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Trade Id</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {job.job_trades.map((trade) => (
                    <tr>
                      <td>{trade.id}</td>
                      <td>{startCase(trade.status)}</td>
                      <td>{trade.description}</td>
                      <td style={{ textAlign: 'right' }}>
                        {trade.invoice_linkable ? (
                          <button
                            type='button'
                            className='button small secondary'
                            onClick={() => onClickLinkJobHandler(trade.id)}
                          >
                            Link
                          </button>
                        ) : (
                          <Tooltip
                            arrow
                            title='Unable to link invoice to this job'
                            position='bottom'
                            animation='fade'
                            theme='light'
                          >
                            <FontAwesomeIcon icon={faExclamationCircle} size='sm' />
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      );
    }

    if (searchResultItems.length < 1 && hasSearched) {
      return <h3 style={{ textAlign: 'center' }}>No Job Found</h3>;
    }

    return null;
  };

  return (
    <ModalContainer
      title='Link Invoice to a Job'
      reactModalProps={{
        className: 'job-reference-modal-container c-modal__container c-modal__container--lg'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='c-modal__body'>
          <p style={{ textAlign: 'center', color: '#d4504b', fontWeight: 'bold' }}>
            <small>
              Please ensure the job you are linking this invoice to is correct. This change is not
              reversible.
            </small>
          </p>
          <p>
            Search and link a job to this invoice. Jobs are filtered by Plan Number and the Creditor
            associated with the invoice.
          </p>
          <fieldset disabled={loading}>
            <div className='form__group form__group--inline'>
              <input
                className='form__control'
                {...register('q')}
                type='text'
                name='q'
                required
                id='q'
                placeholder='Search Trade ID, Job Title / text...'
              />
              <div className='form__control' style={{ marginLeft: '10px' }}>
                <button
                  type='submit'
                  className='button success-button green'
                  style={{ width: '43.5px', height: '43.5px' }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faSearch} size='sm' />
                </button>
              </div>
            </div>
          </fieldset>
          {loading ? (
            <div className='component-loading'>
              <svg
                className='spinner'
                version='1.1'
                id='L9'
                x='0px'
                y='0px'
                viewBox='0 0 100 100'
                enableBackground='new 0 0 0 0'
              >
                <path
                  fill='#333333'
                  d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50'
                >
                  <animateTransform
                    attributeName='transform'
                    attributeType='XML'
                    type='rotate'
                    dur='1s'
                    from='0 50 50'
                    to='360 50 50'
                    repeatCount='indefinite'
                  />
                </path>
              </svg>
            </div>
          ) : (
            renderSearchResults()
          )}
        </div>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(JobReferenceModal);
