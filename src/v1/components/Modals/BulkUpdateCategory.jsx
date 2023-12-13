import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { flashActions, modalActions } from '../../../actions';
import { axiosInstance, chunk } from '../../../utils';
import { FileType } from '../FileType';
import ModalContainer from './ModalContainer';

const BulkUpdateCategory = ({ selectedItems, setReload }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm({ defaultValues: { category: '' } });
  const [failedItems, setFailedItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await axiosInstance.get('/v1/categories');
      const categoriesList = res.data.categories.filter(
        (c) => c?.value?.trim()?.toLowerCase() !== 'invoice'
      );
      setCategories(categoriesList);
    };

    getCategories();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);

    const selectedCategory = data?.category?.value;
    let fails = [];

    const updateItemCategory = async (item) => {
      const params = { category: selectedCategory };
      await axiosInstance
        .put(`/v1/documents/${item.id}`, params)
        .then((_res) => {})
        .catch((err) => {
          fails = [
            ...fails,
            { id: item.id, status: 'error', errorMessage: flashActions.errorMessage(err) }
          ];
        });
    };

    const batches = chunk(selectedItems); // [[Promises1, Promises2, ..., Promises15], [Promises16, ..., Promises30]]

    while (batches.length) {
      const batch = batches.shift();
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((id) => updateItemCategory(id)));
    }

    setFailedItems(fails);
    setSubmitClicked(true);
    if (fails.length === 0) {
      dispatch(flashActions.showSuccess('Updated Category successfully'));
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
      title='BULK EDIT CATEGORY'
      reactModalProps={{
        onAfterClose: handleAfterClose,
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='c-modal__body bulk-approve-invoice-modal-body'>
          <div className='form__group' style={{ maxWidth: '50%', marginBottom: '20px' }}>
            <div className='form__control'>
              <label htmlFor='category'>Category:</label>
            </div>
            <div className='field react-select-field form__control'>
              <Controller
                name='category'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categories}
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={
                      typeof window !== 'undefined' ? document.getElementById('__next') : null
                    }
                  />
                )}
              />
            </div>
          </div>

          <table
            className='table table--default'
            id='table-bulk-approve-invoice'
            style={{ minWidth: '50vw' }}
          >
            <thead>
              <tr>
                <th />
                <th>Plan Number</th>
                <th>Type</th>
                <th>Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => {
                const failedItem = failedItems.find((e) => e.id === item.id);

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
                      <td>{item?.sp_number?.replace(/^sp/i, '')}</td>
                      <td>{item?.category}</td>
                      <td>{item?.display_name}</td>
                      <td>
                        <a
                          href={`/document-preview?id=${item.id}`}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} size='sm' color='#4A90E2' />
                        </a>
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
            cancel
          </button>
          <button
            type='submit'
            className='button button--primary'
            disabled={submitting}
            style={{ marginLeft: '10px' }}
          >
            update category
          </button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default BulkUpdateCategory;
