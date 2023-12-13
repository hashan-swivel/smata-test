import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import * as moment from 'moment';
import { Link } from '../Link';
import { axiosInstance } from '../../../utils';
import { flashActions } from '../../../actions';
import { Loading } from '../Loading';
import { PaginationOptions } from '../Pagination';
import ModalContainer from './ModalContainer';

import './UpcomingWorkModal.module.scss';

const initialState = { keyword: null, currentPage: 1, perPage: 5, totalItems: 0, jobs: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'KEYWORD_CHANGED':
      return { ...state, keyword: action.keyword, currentPage: 1 };
    case 'PAGE_CHANGED':
      return { ...state, currentPage: action.currentPage };
    case 'JOB_CHANGED':
      return { ...state, jobs: action.jobs, totalItems: action.totalItems };
    default:
      throw new Error();
  }
}

const UpcomingWorkModal = ({ buildingProfile }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [formFilter, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingWork();
  }, [formFilter.keyword, formFilter.currentPage]);

  const changePage = (pageNumber) => dispatch({ type: 'PAGE_CHANGED', currentPage: pageNumber });

  const getUpcomingWork = async () => {
    const params = {
      keyword: formFilter.keyword,
      per_page: formFilter.perPage,
      upcoming_work: 'true',
      pagination: 'true',
      page: formFilter.currentPage
    };
    setLoading(true);

    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(buildingProfile?.site_plan_id)}/jobs`, {
        params
      })
      .then((res) => {
        dispatch({
          type: 'JOB_CHANGED',
          jobs: res.data.jobs,
          totalItems: res.data.meta.total_count
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(flashActions.showError(error));
        setLoading(false);
      });
  };

  const keywordChangeHandler = (e) => {
    debouncedKeywordChangeHandler(e.target.value);
  };

  const debouncedKeywordChangeHandler = useCallback(
    debounce((val) => dispatch({ type: 'KEYWORD_CHANGED', keyword: val }), 700),
    []
  );

  if (!buildingProfile?.can_view_upcoming_works) return null;

  const searchResult = () => {
    if (loading) return <Loading componentLoad />;

    return (
      <div className='upcoming-work-items'>
        {formFilter.jobs.map((job) => (
          <Job job={job} currentUser={currentUser} />
        ))}
      </div>
    );
  };

  return (
    <ModalContainer
      title='Upcoming Work'
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        className: 'c-modal__container c-modal__container--lg create-noticeboard-modal'
      }}
    >
      <div className='c-modal__body'>
        <fieldset className='fieldset'>
          <div className='form__group'>
            <input
              className='form__control input'
              required
              type='text'
              name='keyword'
              defaultValue={formFilter.keyword}
              onChange={keywordChangeHandler}
              placeholder='Search by job title, description, contractor...'
            />
          </div>
          <div className='form__group'>
            <PaginationOptions
              totalItems={formFilter.totalItems}
              perPage={formFilter.perPage}
              changePage={changePage}
              currentPage={formFilter.currentPage}
            />
          </div>
        </fieldset>
        {searchResult()}
      </div>
    </ModalContainer>
  );
};

const Job = ({ job, currentUser }) => {
  const [showAllTrades, setShowAllTrades] = useState(false);

  const jobLink = () => {
    const nameSpace = currentUser?.namespace;
    if (nameSpace) return `${currentUser?.baseUrl}/${nameSpace}/jobs/${job.id}`;

    return `${currentUser?.baseUrl}/jobs/${job.job_reference_id}?access_token=${job.access_token}`;
  };

  const trades = () => {
    if (showAllTrades) {
      return (
        <div className='upcoming-trade-items'>
          {job.job_trades.map((jobTrade) => (
            <div className='upcoming-trade-item'>
              <div className='upcoming-trade-item--header'>
                {`ID ${jobTrade.id} - ${
                  jobTrade.job_type === 'do_and_charge' ? 'Work Order' : 'Quote Request'
                }${
                  jobTrade.due_date ? ` - Due ${moment.unix(jobTrade.due_date).format('L')}` : ''
                }`}
              </div>
              <div className='upcoming-trade-item--body'>
                <table>
                  <colgroup>
                    <col span='1' style={{ width: '70%' }} />
                    <col span='1' style={{ width: '30%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Contractor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobTrade.job_trade_contractors.map((jtc) => (
                      <tr>
                        <td>{jtc.contractor_name}</td>
                        <td>{jtc.state}</td>
                      </tr>
                    ))}
                    {jobTrade.length === 0 && (
                      <tr>
                        <td colSpan={2}>Not Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <button
        type='button'
        onClick={() => setShowAllTrades(true)}
        className='button button--link'
        style={{ padding: 0, textTransform: 'none', fontSize: '.8rem' }}
      >
        View Details...
      </button>
    );
  };

  return (
    <div key={job.id} className='upcoming-work-item' role='presentation'>
      <Link href={jobLink(job)} title={job.title} target='_self' classNameProp='default--link-dark'>
        {job.title}
      </Link>
      <div className='upcoming-work-timestamps'>
        <strong>Posted:</strong>
        &nbsp;
        {moment.unix(job.created_at).format('lll')} - <strong>Updated:</strong>
        &nbsp;
        {moment.unix(job.updated_at).format('lll')}
      </div>
      {job.job_trades && job.job_trades.length > 0 ? trades() : <div>{job.description}</div>}
    </div>
  );
};

export default UpcomingWorkModal;
