import React, { useState, useEffect } from 'react';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance, userOptionObj } from '../../../../utils';
import { flashActions, modalActions } from '../../../../actions';
import ModalContainer from '../ModalContainer';
import { Loading } from '../../Loading.jsx';

import './MissingStrataMasterDataModal.module.scss';

const MissingStrataMasterDataModal = ({ organisationId, resourceName }) => {
  const [loading, setLoading] = useState(true);
  const [previewMissingItems, setPreviewMissingItems] = useState([]);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    getPreviewMissingData();
  }, []);

  const getPreviewMissingData = async () => {
    setLoading(true);
    await axiosInstance
      .get('/v1/strata_master_data_logs/preview_missing_items', {
        params: {
          organisation_id: organisationId,
          resource_name: resourceName
        }
      })
      .then((res) => {
        setPreviewMissingItems(res?.data);
        setLoading(false);
        if (res?.data?.length === 0) {
          dispatch(flashActions.showError('There is no new items to be imported'));
        }
      })
      .catch((error) => {
        setPreviewMissingItems([]);
        setLoading(false);
        dispatch(flashActions.showError(error));
      });
  };

  const missingItemsContainer = () => {
    if (loading) {
      return <Loading />;
    }

    return (
      <table className='table table--default'>
        <thead>
          <tr>
            <th>External Id</th>
          </tr>
        </thead>
        <tbody>
          {previewMissingItems.map((item) => (
            <tr>
              <td>{item.external_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <ModalContainer
      title='Preview Missing Items'
      reactModalProps={{ className: 'c-modal__container c-modal__container--lg' }}
    >
      <div className='c-modal__body preview-missing-items-modal-container'>
        {missingItemsContainer()}
      </div>
      <div className='c-modal__footer'>
        <button
          type='button'
          className='button button--link-dark'
          onClick={() => dispatch(modalActions.hideModal())}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </ModalContainer>
  );
};

export default MissingStrataMasterDataModal;
