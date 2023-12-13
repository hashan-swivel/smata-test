import React, { useState } from 'react';
import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { flashActions, modalActions } from '../../../actions';
import { axiosInstance, chunk } from '../../../utils';
import { FileType } from '../FileType';
import ModalContainer from './ModalContainer';

import './BulkUpdatePriorityModal.module.scss';

const BulkUpdatePriorityModal = ({ selectedItems, setReload, newPriority, dispatch }) => {
  const { register, handleSubmit } = useForm();
  const [failedItems, setFailedItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const onSubmit = async (data) => {
    setSubmitting(true);

    let fails = [];

    const updatePriority = async (item) => {
      // update only if the current priority is different
      if (item.priority !== newPriority) {
        const reason = data[item.id];
        const params = {
          priority: newPriority,
          reason: reason === '' ? undefined : reason
        };
        await axiosInstance
          .put(`/v1/documents/${item.id}/update_priority`, params)
          .then((_res) => {})
          .catch((err) => {
            fails = [
              ...fails,
              {
                id: item.id,
                status: 'error',
                errorMessage: flashActions.errorMessage(err)
              }
            ];
          });
      }
    };

    const batches = chunk(selectedItems); // [[Promises1, Promises2, ..., Promises15], [Promises16, ..., Promises30]]

    while (batches.length) {
      const batch = batches.shift();
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((id) => updatePriority(id)));
    }

    setFailedItems(fails);
    setSubmitClicked(true);
    if (fails.length === 0) {
      dispatch(
        flashActions.showSuccess(`${newPriority ? 'Added' : 'Removed'} priority successfully`)
      );
      dispatch(modalActions.hideModal());
    } else {
      setSubmitting(false);
      setAlertMessage(
        'Some of the selected documents failed update. Please review them individually.'
      );
      dispatch(
        flashActions.showError(
          'Some of the selected documents failed update. Please review them individually.'
        )
      );
    }
  };

  function handleAfterClose() {
    if (submitClicked) {
      setTimeout(() => setReload(true), 1200); // without the delay document API returns old data
    }
  }

  return (
    <ModalContainer
      title={`BULK ${newPriority ? 'ADD' : 'REMOVE'} PRIORITY`}
      reactModalProps={{
        onAfterClose: handleAfterClose,
        className: 'c-modal__container c-modal__container--lg bulk-update-priority'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='c-modal__body'>
          <table className='table table--default' style={{ minWidth: '50vw' }}>
            <thead>
              <tr>
                <th />
                <th>Plan Number</th>
                <th>Contractor</th>
                <th>No.</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => {
                const failedItem = failedItems.find((e) => e.id === item.id);

                const { sp_number, invoice, contractor, priority } = item;
                const plan = sp_number?.replace(/^sp/i, '');

                return (
                  <React.Fragment key={item.id}>
                    {failedItem && (
                      <tr key={`${item.id}-error`} className='error'>
                        <td colSpan={5}>
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            size='sm'
                            className='text--danger'
                          />
                          &nbsp;&nbsp;
                          <span className='text--danger'>{failedItem.errorMessage}</span>
                        </td>
                      </tr>
                    )}
                    {priority === newPriority && (
                      <tr key={`${item.id}-info`} className='error'>
                        <td colSpan={5}>
                          <FontAwesomeIcon icon={faInfoCircle} size='sm' className='text--danger' />
                          &nbsp;&nbsp;
                          <span>
                            {priority ? 'Already marked as priority' : 'No priority on invoice'}
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr key={item.id}>
                      <td>
                        <FileType type={item?.file_extension} />
                      </td>
                      <td>{plan}</td>
                      <td>{contractor?.name}</td>
                      <td>{invoice?.invoice_number}</td>
                      <td>
                        <input disabled={priority === newPriority} {...register(`${item.id}`)} />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {alertMessage.length !== 0 && (
            <h4 className='text--danger' style={{ textAlign: 'center', marginTop: '10px' }}>
              {alertMessage}
            </h4>
          )}
        </div>

        <div className='c-modal__footer'>
          <button
            type='button'
            className='button button--link-dark'
            disabled={submitting}
            onClick={() => dispatch(modalActions.hideModal())}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='button button--primary'
            disabled={submitting}
            style={{ marginLeft: '10px' }}
          >
            Confirm
          </button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(BulkUpdatePriorityModal);
