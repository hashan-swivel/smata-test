import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { axiosInstance, warningSwal } from '@/utils';
import { NotFound } from '../../../DMS';
import { Loading } from '../../../Loading.jsx';
import { ListItem } from './ListItem';
import { buildingDocumentCategoryActions, flashActions } from '@/actions';
import { buildingDocumentCategoryConstants } from '@/constants';

import Accordion from '../../../DMS/InvoiceView/Accordion';

import '../../../DMS/InvoiceView/Accordion.module.scss';

const List = ({ list, listLoading, accountId, updateView, handleEditClick, canEdit, dispatch }) => {
  const [params, setParams] = useState({ by_keyword: '', page: 1 });
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historiesData, setHistoriesData] = useState([]);
  const basePath = buildingDocumentCategoryConstants.BASE_PATH.replace('account-id', accountId);

  useEffect(() => {
    dispatch(buildingDocumentCategoryActions.getBuildingDocumentCategories(accountId, params));
    fetchHistories();
  }, [params]);

  const handleChange = (event) => {
    const { value } = event.target;
    setParams({ by_keyword: value, page: 1 });
  };

  const handleDeleteClick = (rule_id) => {
    deleteRule(rule_id);
  };

  const deleteRule = async (rule_id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire(warningSwal({ confirmButtonText: 'DELETE' })).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`${basePath}/${rule_id}`)
          .then(() =>
            dispatch(
              buildingDocumentCategoryActions.getBuildingDocumentCategories(accountId, params)
            )
          )
          .catch((err) => dispatch(flashActions.showError(err)));
      }
    });
  };

  const ListContainer = () => {
    if (listLoading) {
      return <Loading />;
    }
    if (list.length === 0) {
      return <NotFound text='No Rules Found' />;
    }
    return list.map((item) => (
      <ListItem
        item={item}
        key={item.id}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        canEdit={canEdit}
        dispatch={dispatch}
      />
    ));
  };

  const fetchHistories = async () => {
    setLoadingHistory(true);
    await axiosInstance
      .get(`${basePath}/histories`)
      .then((res) => {
        setHistoriesData(res.data.building_document_category_histories);
        setLoadingHistory(false);
      })
      .catch(() => {
        setHistoriesData([]);
        setLoadingHistory(false);
      });
  };

  const DocumentSharingRuleHistoriesContainer = () => {
    if (loadingHistory || historiesData.length === 0) {
      return null;
    }
    return (
      <Accordion title='History:'>
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
    );
  };

  return (
    <>
      <form className='filter-form'>
        <div className='form__group form__group--inline' style={{ gap: '.5rem' }}>
          <input
            className='form__control input'
            type='text'
            placeholder='Search description, category...'
            value={params.by_keyword}
            onChange={handleChange}
          />
          {canEdit && (
            <button
              type='button'
              className='button button--primary'
              onClick={() => updateView('new')}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>
      </form>

      {ListContainer()}
      {DocumentSharingRuleHistoriesContainer()}
    </>
  );
};

export default connect((state) => state.buildingDocumentCategories)(List);
