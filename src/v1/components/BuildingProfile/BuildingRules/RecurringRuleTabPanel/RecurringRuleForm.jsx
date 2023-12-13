import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { axiosInstance, menuPortalTarget } from '@/utils';
import { flashActions } from '@/actions';

const typeOptions = [
  { value: 'GlCode', label: 'GL Code' },
  { value: 'Contractor', label: 'Contractor' }
];

const RecurringRuleForm = ({ updateView, currentRule, spNumber, currentUser }) => {
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({});
  const [submitting, setSubmitting] = useState(false);

  const [selectedType, setSelectedType] = useState(currentRule?.recurringable_type);
  const [selectedContractor, setSelectedContractor] = useState(currentRule?.recurringable);
  const [selectedGlCode, setSelectedGlCode] = useState(currentRule?.recurringable);
  const [glCodeOptions, setGlCodeOptions] = useState([]);

  const loadGlCodes = async () => {
    const params = { organisation_id: currentUser?.organisation_id };
    await axiosInstance
      .get('/v1/gl_codes', { params })
      .then((res) =>
        setGlCodeOptions(res.data.gl_codes.map((c) => ({ ...c, value: c.id, label: c.full_name })))
      )
      .catch(() => setGlCodeOptions([]));
  };

  useEffect(() => {
    loadGlCodes();
  }, []);

  const loadContractors = (inputValue, callback) => {
    const params = {
      organisation_id: currentUser?.organisation_id,
      search: inputValue?.length > 0 ? inputValue : null
    };

    axiosInstance
      .get('/v1/contractors', { params })
      .then((res) =>
        callback(res.data.contractors.map((c) => ({ ...c, value: c.id, label: c.name })))
      )
      .catch(() => callback([]));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    if (currentRule) {
      const { recurringable_type, recurringable_id, ...body } = data;

      await axiosInstance
        .put(
          `/v1/building_profile/${encodeURIComponent(spNumber)}/building_recurring_rules/${
            currentRule.id
          }`,
          body
        )
        .then(() => {
          setSubmitting(false);
          dispatch(flashActions.showSuccess('Recurring rule has been saved'));
          updateView('index');
        })
        .catch((error) => {
          setSubmitting(false);
          dispatch(flashActions.showError(error));
        });
    } else {
      await axiosInstance
        .post(`/v1/building_profile/${encodeURIComponent(spNumber)}/building_recurring_rules`, data)
        .then(() => {
          setSubmitting(false);
          dispatch(flashActions.showSuccess('Recurring rule has been created'));
          updateView('index');
        })
        .catch((error) => {
          setSubmitting(false);
          dispatch(flashActions.showError(error));
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={submitting}>
        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='description'>Description</label>
          </div>
          <input
            className='form__control'
            {...register('description', { required: 'Can not be blank' })}
            type='text'
            name='description'
            id='recurring-rule-description'
            defaultValue={currentRule?.description || ''}
            placeholder='Description for the rule'
          />
          {errors.description && (
            <div className='invalid-feedback'>{errors.description.message}</div>
          )}
        </div>

        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='recurringable_type'>Type</label>
          </div>
          <div className='form__control'>
            <Controller
              control={control}
              defaultValue={selectedType}
              {...register('recurringable_type', { required: "can't be blank" })}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  options={typeOptions}
                  value={typeOptions.find((t) => t.value === value)}
                  onChange={(o) => {
                    setSelectedType(o.value);
                    onChange(o.value);
                  }}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={menuPortalTarget}
                  placeholder='Select Type'
                  isDisabled={currentRule?.id}
                />
              )}
            />
            {errors.recurringable_type && (
              <div className='invalid-feedback'>{errors.recurringable_type.message}</div>
            )}
          </div>
        </div>

        {selectedType === 'Contractor' && (
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='recurringable_id'>Contractor</label>
            </div>
            <div className='form__control'>
              <Controller
                control={control}
                {...register('recurringable_id', {
                  required: currentRule?.id ? false : "can't be blank"
                })}
                render={({ field: { onChange } }) => (
                  <AsyncSelect
                    cacheOptions
                    value={selectedContractor}
                    loadOptions={debounce(loadContractors, 1000)}
                    defaultOptions
                    onChange={(o) => {
                      setSelectedContractor(o);
                      onChange(o.value);
                    }}
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={menuPortalTarget}
                    isDisabled={currentRule?.id}
                    placeholder='Search creditor name, business number / gst number...'
                  />
                )}
              />
            </div>
            {errors.recurringable_id && (
              <div className='invalid-feedback'>{errors.recurringable_id.message}</div>
            )}
          </div>
        )}

        {selectedType === 'GlCode' && (
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='recurringable_id'>GL Code</label>
            </div>
            <div className='form__control'>
              <Controller
                control={control}
                defaultValue={selectedGlCode}
                {...register('recurringable_id', {
                  required: currentRule?.id ? false : "can't be blank"
                })}
                render={({ field: { onChange } }) => (
                  <Select
                    options={glCodeOptions}
                    value={selectedGlCode}
                    onChange={(o) => {
                      setSelectedGlCode(o);
                      onChange(o.value);
                    }}
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={menuPortalTarget}
                    placeholder='Select GL Code'
                    isDisabled={currentRule?.id}
                  />
                )}
              />
            </div>
            {errors.recurringable_id && (
              <div className='invalid-feedback'>{errors.recurringable_id.message}</div>
            )}
          </div>
        )}

        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='minimum'>Minimum ($)</label>
          </div>
          <input
            className='form__control'
            {...register('minimum', { required: "can't be blank" })}
            type='number'
            name='minimum'
            defaultValue={currentRule?.minimum || 0.0}
            placeholder='Minimum amount of the invoice'
          />
          {errors.minimum && <div className='invalid-feedback'>{errors.minimum.message}</div>}
        </div>

        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='maximum'>Maximum ($)</label>
          </div>
          <input
            className='form__control'
            {...register('maximum', { required: "can't be blank" })}
            type='number'
            name='maximum'
            defaultValue={currentRule?.maximum || 0.0}
            placeholder='Maximum amount of the invoice'
          />
          {errors.maximum && <div className='invalid-feedback'>{errors.maximum.message}</div>}
        </div>
      </fieldset>

      <div className='recurring-rules-footer-button-container'>
        <button
          type='button'
          className='button button--secondary'
          onClick={(e) => updateView(e, 'index')}
        >
          Cancel
        </button>
        <button type='submit' className='button button--primary save-btn' disabled={submitting}>
          {currentRule ? 'Edit' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default RecurringRuleForm;
