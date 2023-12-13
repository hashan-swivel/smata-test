import React, { useEffect, useState } from 'react';
import * as moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance, warningSwal } from '@/utils';
import { NotFound } from '../../../DMS';
import { Loading } from '../../../Loading.jsx';
import RecurringRuleItem from './RecurringRuleItem';
import Accordion from '../../../DMS/InvoiceView/Accordion';

import '../../../DMS/InvoiceView/Accordion.module.scss';

const RecurringRuleList = ({
  spNumber,
  updateView,
  handleEditRuleClick,
  viewOnly,
  currentUser
}) => {
  const canEdit = !viewOnly && currentUser?.isTenantManager;

  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [ruleData, setRuleData] = useState([]);
  const [historiesData, setHistoriesData] = useState([]);

  useEffect(() => {
    fetchRules();
    fetchHistoriesRules();
  }, [searchKeyword]);

  const handleDeleteRuleClick = (rule_id) => {
    deleteRule(rule_id);
  };

  const deleteRule = async (rule_id) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire(warningSwal({ confirmButtonText: 'DELETE' })).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(
            `/v1/building_profile/${encodeURIComponent(
              spNumber
            )}/building_recurring_rules/${rule_id}`
          )
          .then(() => {
            setRuleData(ruleData.filter((rule) => rule.id !== rule_id));
            fetchHistoriesRules();
          })
          .catch(() => console.error);
      }
    });
  };

  const fetchRules = async () => {
    setLoading(true);
    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(spNumber)}/building_recurring_rules`, {
        params: { q: searchKeyword }
      })
      .then((res) => {
        setRuleData(res.data.recurring_rules);
        setLoading(false);
      })
      .catch(() => {
        setRuleData([]);
        setLoading(false);
      });
  };

  const RecurringRuleContainer = () => {
    if (loading) {
      return <Loading />;
    }
    if (ruleData.length === 0) {
      return <NotFound text='No Rules Found' />;
    }
    return ruleData.map((rule) => (
      <RecurringRuleItem
        rule={rule}
        key={rule.id}
        handleEditRuleClick={handleEditRuleClick}
        handleDeleteRuleClick={handleDeleteRuleClick}
        canEdit={canEdit}
      />
    ));
  };

  const fetchHistoriesRules = async () => {
    setLoadingHistory(true);
    await axiosInstance
      .get(
        `/v1/building_profile/${encodeURIComponent(spNumber)}/building_recurring_rules/histories`
      )
      .then((res) => {
        setHistoriesData(res.data.recurring_rule_histories);
        setLoadingHistory(false);
      })
      .catch(() => {
        setHistoriesData([]);
        setLoadingHistory(false);
      });
  };

  const RecurringRuleHistoriesContainer = () => {
    if (loadingHistory || historiesData.length === 0) {
      return null;
    }
    return (
      <React.Fragment>
        <Accordion title='Recurring rule history:'>
          <div className='building-rule-view-block-content'>
            <ul className='building-rule-history-list'>
              {historiesData &&
                historiesData.map((item, index) => (
                  <li
                    key={`${index.toString()}-${item.created_at}`}
                    className='building-rule-history-item'
                  >
                    <span className='building-rule-history-item-date'>
                      <strong>{moment(item.created_at, 'X').format('DD MMM YY')}</strong>
                    </span>
                    <span className='building-rule-history-item-message'>{item.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        </Accordion>
      </React.Fragment>
    );
  };

  return (
    <>
      {(currentUser?.isStrataMember || currentUser?.isSystemManager) && (
        <p className='alert-disabled-rule'>
          <strong>*&nbsp;&nbsp; You are not able to adjust these rules</strong>
        </p>
      )}
      <form className='filter-form'>
        <div className='form__group form__group--inline' style={{ gap: '.5rem' }}>
          <input
            className='form__control input'
            type='text'
            placeholder='Search description, category...'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          {canEdit && (
            <button
              type='button'
              className='button button--primary'
              onClick={(e) => updateView(e, 'new')}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>
      </form>

      {RecurringRuleContainer()}
      {RecurringRuleHistoriesContainer()}
    </>
  );
};

export default RecurringRuleList;
