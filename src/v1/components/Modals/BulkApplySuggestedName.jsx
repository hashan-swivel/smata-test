import React, { useState } from 'react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { flashActions, modalActions } from '../../../actions';
import { axiosInstance, chunk } from '../../../utils';
import { FileType } from '../FileType';
import ModalContainer from './ModalContainer';

const BulkApplySuggestedName = ({ selectedItems, setReload, dispatch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [failedItems, setFailedItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const getSuggestedName = (doc) => {
    const { sp_number, category, display_name } = doc;
    const plan = sp_number?.replace(/^sp/i, '');

    // check if doc is already renamed with the suggested name
    if (doc?.filename.startsWith(`${plan}_-_${category}_-_`)) {
      return doc?.display_name;
    }
    return `${plan} - ${category} - ${display_name}`;
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    let fails = [];

    const applySuggestedName = async (item) => {
      const suggestedName = data[item.id];

      // update only if the name is changed
      if (suggestedName !== item.display_name) {
        const params = {
          display_filename: suggestedName
        };
        await axiosInstance
          .put(`/v1/documents/${item.id}`, params)
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
      await Promise.all(batch.map((id) => applySuggestedName(id)));
    }

    setFailedItems(fails);
    setSubmitClicked(true);

    setTimeout(() => setReload(true), 1200); // Because of Elasticsearch 1 second delay issue

    if (fails.length === 0) {
      dispatch(flashActions.showSuccess('Applied suggested names successfully'));
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
    if (submitClicked) setReload(true);
  }

  return (
    <ModalContainer
      title='BULK APPLY SUGGESTED NAME'
      reactModalProps={{
        onAfterClose: handleAfterClose,
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='c-modal__body'>
          <table className='table table--default' style={{ minWidth: '50vw' }}>
            <thead>
              <tr>
                <th />
                <th>Plan Number</th>
                <th>Type</th>
                <th>Name</th>
                <th>Suggested Name</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => {
                const failedItem = failedItems.find((e) => e.id === item.id);

                const { sp_number, category, display_name } = item;
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
                    <tr key={item.id}>
                      <td>
                        <FileType type={item?.file_extension} />
                      </td>
                      <td>{plan}</td>
                      <td>{category}</td>
                      <td>
                        <span title={display_name}>{display_name}</span>
                      </td>
                      <td style={{ width: '35%' }}>
                        <input
                          defaultValue={getSuggestedName(item)}
                          {...register(`${item.id}`, { required: true })}
                        />
                        {errors[`${item.id}`] ? (
                          <span className='text--danger'>! Name is required</span>
                        ) : null}
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

export default connect((state) => state.modal)(BulkApplySuggestedName);
