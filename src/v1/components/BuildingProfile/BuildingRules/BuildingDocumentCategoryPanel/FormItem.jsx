import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@/utils';
import { flashActions } from '@/actions';
import { getCategories } from '@/actions/categories';
import { buildingDocumentCategoryConstants } from '@/constants';

import './BuildingDocumentCategoryPannel.module.scss';

const menuPortalTarget = typeof window !== 'undefined' ? document.getElementById('__next') : null;
const defaultShareWithOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'committee_member', label: 'Committee Member' },
  { value: 'building_manager', label: 'Building Manager' },
  { value: 'building_inspector', label: 'Building Inspector' }
];

const FormItem = ({ dispatch, updateView, item, accountId }) => {
  const [shareWithOptions, setShareWithOptions] = useState(defaultShareWithOptions);
  const currentPermissions = item.building_document_permissions
    ? item.building_document_permissions
    : [];

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      description: item.description,
      category: item.category,
      share_with: currentPermissions
    }
  });

  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);
  const basePath = buildingDocumentCategoryConstants.BASE_PATH.replace('account-id', accountId);
  const watchedCategory = watch('category') || {};
  const watchedShareWith = watch('share_with') || [];

  useEffect(() => {
    if (!categories.length && categoriesLoading) dispatch(getCategories());
  }, [categories]);

  useEffect(() => {
    if (watchedCategory.label?.toLowerCase() === 'invoice') {
      setShareWithOptions(
        shareWithOptions.map((o) =>
          o.value === 'building_inspector' ? { ...o, isDisabled: true } : o
        )
      );
      setValue(
        'share_with',
        watchedShareWith.filter((o) => o.value !== 'building_inspector')
      );
    } else {
      setShareWithOptions(defaultShareWithOptions);
    }
  }, [watchedCategory]);

  const onSubmit = async (data) => {
    const payload = {
      category_id: data.category?.id,
      description: data.description
    };

    if (item.id) {
      payload.building_document_permissions_attributes = [];
      currentPermissions.forEach((p) => {
        if (!data.share_with.find((i) => i.value === p.value)) {
          payload.building_document_permissions_attributes.push({ id: p.id, _destroy: true });
        }
      });
      data.share_with.forEach((p) => {
        if (!currentPermissions.find((i) => i.value === p.value)) {
          payload.building_document_permissions_attributes.push({ role: p.value, key: 'read' });
        }
      });
      await axiosInstance
        .put(`${basePath}/${item?.id}`, payload)
        .then(() => {
          dispatch(flashActions.showSuccess('Document Rule has been updated'));
          updateView('index');
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
        });
    } else {
      payload.building_document_permissions_attributes = data.share_with.map((r) => ({
        role: r.value,
        key: 'read'
      }));

      await axiosInstance
        .post(basePath, payload)
        .then(() => {
          dispatch(flashActions.showSuccess('Document Rule has been created'));
          updateView('index');
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting} className='fieldset'>
        {watchedCategory.label?.toLowerCase() === 'invoice' && (
          <div className='alert alert--warning'>
            Invoice is not applicable for Building Inspector.
          </div>
        )}
        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='category'>Category</label>
          </div>
          <div className='form__control'>
            <Controller
              name='category'
              control={control}
              {...register('category', { required: 'Please select a category.' })}
              render={({ field }) => (
                <Select
                  {...field}
                  name='type'
                  options={categories}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={menuPortalTarget}
                />
              )}
            />
          </div>
          {errors.category && <div className='invalid-feedback'>{errors.category.message}</div>}
        </div>
        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='description'>Description</label>
          </div>
          <input
            className='form__control input'
            {...register('description', { required: 'Can not be blank.' })}
            type='text'
            name='description'
          />
          {errors.description && (
            <div className='invalid-feedback'>{errors.description.message}</div>
          )}
        </div>
        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='share_with'>Share with roles</label>
          </div>
          <div className='form__control'>
            <Controller
              name='share_with'
              className="select"
              control={control}
              {...register('share_with', { required: 'Please select at least 1 role.' })}
              render={({ field }) => (
                <Select
                  {...field}
                  name='share_with'
                  isMulti
                  options={shareWithOptions}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={menuPortalTarget}
                />
              )}
            />
          </div>
          {errors.share_with && <div className='invalid-feedback'>{errors.share_with.message}</div>}
        </div>
        <div className='footer-button-container'>
          <button
            type='button'
            className='button button--link-dark'
            disabled={isSubmitting}
            onClick={() => updateView('index')}
          >
            Back
          </button>
          <button
            type='submit'
            className='button button--primary'
            style={{ marginLeft: '10px', minWidth: '100px' }}
          >
            {item?.id ? 'Edit' : 'Add'}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default FormItem;
