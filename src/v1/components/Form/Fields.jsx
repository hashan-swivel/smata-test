import React from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';
import { ReactSelect, Toggle } from './Fields';
import { ValidationError } from './ValidationError';

const getFieldClass = (field, active) => {
  const classNames = ['field'];
  if (field.leftCol) classNames.push('split left-col');
  if (field.rightCol) classNames.push('split right-col');
  if (field.hidden) classNames.push('hidden');
  if (field.classNames) classNames.push(field.classNames);
  if (active) classNames.push('active');
  return classNames.join(' ');
};

const appRoot = typeof window !== 'undefined' ? document.getElementById('__next') : null;

const maxLength = (max) => (value, previousValue, allValues) =>
  value.length <= max ? value : previousValue?.substring(0, max);

const getNormalizing = (field) => {
  if (field.isNormalize) {
    if (field.maxLength) {
      return maxLength(field.maxLength);
    }
  } else {
    return null;
  }
};

export const Fields = (props) => {
  const {
    containerClass,
    fields,
    values,
    submitFailed,
    syncErrors,
    formName,
    onChange,
    customOnChange,
    onInputChange,
    filterOption,
    onMenuScrollToBottom
  } = props;

  if (!fields) return null;

  return (
    <div className={`fields ${containerClass || null}`}>
      {fields.map((field, index) => {
        if (field.isHidden) {
          return null;
        }

        if (field.component === 'heading') {
          return (
            <div
              key={`heading-${field.name}-${index}`}
              className={`field field-heading ${field.classNames || ''}`}
            >
              <h5>{field.label}</h5>
              {field.hint}
              {field.tooltip}
            </div>
          );
        }

        if (field.component === 'radio' || field.component === 'checkbox') {
          return (
            <div
              key={`checkbox-${field.name}-${index}`}
              className={`field checkboxes-field ${field.classNames || ''}`}
            >
              <div className='fieldtitle'>
                {!field.noLabel && <span className='label'>{field.label}:</span>}
                <ValidationError
                  submitFailed={submitFailed}
                  errors={syncErrors}
                  field={field.name}
                  formName={formName}
                />
              </div>
              <div className='options'>
                {field.options.map((option, i) => (
                  <span className='option' key={`option-${field.name}-${i}-${option.value}`}>
                    <Field
                      type={field.component || 'checkbox'}
                      name={field.name}
                      defaultChecked={field.defaultChecked}
                      checked={
                        field.component === 'radio'
                          ? values[field.name] === option.value
                          : values[field.name]
                      }
                      component='input'
                      value={option.value}
                      id={field.id || option.value}
                      className={field.component}
                      disabled={field.disabled}
                    />
                    {field.hintBanner}
                    <label htmlFor={field.id || option.value} id={field.id || option.value}>
                      <span dangerouslySetInnerHTML={{ __html: option.label }} />
                    </label>
                  </span>
                ))}
              </div>
            </div>
          );
        }

        if (field.component === 'select' || field.component === 'datalist') {
          const isOptGroup = field.options && field.options[0] && field.options[0].options;

          return (
            <div
              key={`select-${field.name}-${index}`}
              className={`field select-field ${field.classNames || ''}`}
            >
              <div className='fieldtitle'>
                {!field.noLabel && (
                  <span className='label'>
                    {field.label} {field.hint && <span className='label-hint'>{field.hint}</span>}
                    {field.tooltip}:
                  </span>
                )}
                <ValidationError
                  submitFailed={submitFailed}
                  errors={syncErrors}
                  field={field.name}
                  formName={formName}
                />
              </div>
              <Field
                component={field.component}
                name={field.name}
                id={field.name}
                value={field.value || ''}
                className={field.type}
                onChange={field.customOnChange}
                disabled={field.disabled}
              >
                <option value='' disabled>
                  {field.placeholder || 'Please select'}
                </option>
                {field.options.map((option) => {
                  if (isOptGroup) {
                    return (
                      <optgroup label={option.label}>
                        {option.options.map((optGroupOption) => (
                          <option value={optGroupOption.value} key={optGroupOption.value}>
                            {optGroupOption.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  }
                  return (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </Field>
              {field.hintBanner}
            </div>
          );
        }

        const isActive = values && values[field.name];

        if (field.component === 'react-select') {
          const onChangeFunction = field.customOnChange ? field.customOnChange : onChange;
          return (
            <div
              key={`react-select-${field.name}-${index}`}
              className={getFieldClass(field, isActive)}
            >
              <div className='fieldtitle'>
                {!field.noLabel && (
                  <label htmlFor={field.name}>
                    {field.label} {field.hint && <span className='label-hint'>{field.hint}</span>}
                    {field.tooltip}
                  </label>
                )}
                <ValidationError
                  submitFailed={submitFailed}
                  errors={syncErrors}
                  field={field.name}
                  type={field.type}
                  formName={formName}
                />
              </div>
              <Field
                {...field}
                key={field.name}
                component={ReactSelect}
                selectedOption={get(values, field.name)}
                submitFailed={submitFailed}
                errors={syncErrors}
                disabled={field.disabled}
                menuPortalTarget={appRoot}
                onChange={field.disableOnChange ? null : onChangeFunction}
                onInputChange={onInputChange}
                filterOption={filterOption}
                onMenuScrollToBottom={onMenuScrollToBottom}
              />
              {field.hintBanner}
            </div>
          );
        }

        if (field.component === 'toggle') {
          return (
            <div key={`toggle-${field.name}-${index}`} className={getFieldClass(field, isActive)}>
              <div className='fieldtitle'>
                {!field.noLabel && (
                  <label htmlFor={field.name}>
                    {field.label} {field.hint && <span className='label-hint'>{field.hint}</span>}
                    {field.tooltip}
                  </label>
                )}
                <ValidationError
                  submitFailed={submitFailed}
                  errors={syncErrors}
                  field={field.name}
                  type={field.type}
                  formName={formName}
                />
              </div>
              <Field
                {...field}
                key={field.name}
                component={Toggle}
                values={field.checked}
                onChange={field.onChange}
                submitFailed={submitFailed}
                errors={syncErrors}
                disabled={field.disabled}
              />
              {field.hintBanner}
            </div>
          );
        }

        if (field.component === 'DatePicker') {
          return (
            <div
              key={`datepicker-${field.name}-${index}`}
              className={getFieldClass(field, isActive)}
            >
              <div className='fieldtitle'>
                {!field.noLabel && (
                  <label htmlFor={field.name}>
                    {field.label} {field.hint && <span className='label-hint'>{field.hint}</span>}
                    {field.tooltip}
                  </label>
                )}
                <ValidationError
                  submitFailed={submitFailed}
                  errors={syncErrors}
                  field={field.name}
                  type={field.type}
                  formName={formName}
                />
              </div>
              <Field
                component={field.component}
                type={field.type || 'text'}
                name={field.name}
                pattern={field.pattern}
                placeholder={field.placeholder || field.label}
                autoComplete={field.disabledAutoComplete ? 'no-complete' : 'on'}
                submitFailed={submitFailed}
                disabled={field.disabled}
                value={field.value[0] || ''}
                minDate={field.minDate}
              />
              {field.hintBanner}
            </div>
          );
        }

        return (
          <div key={`field-${field.name}-${index}`} className={getFieldClass(field, isActive)}>
            <div className='fieldtitle'>
              {!field.noLabel && (
                <label htmlFor={field.name}>
                  {field.label} {field.hint && <span className='label-hint'>{field.hint}</span>}
                  {field.tooltip}
                </label>
              )}
              <ValidationError
                submitFailed={submitFailed}
                errors={syncErrors}
                field={field.name}
                type={field.type}
                formName={formName}
                noValidation={field.noValidation}
              />
            </div>
            <Field
              component={field.component || 'input'}
              type={field.type || 'text'}
              name={field.name}
              pattern={field.pattern}
              placeholder={field.placeholder || field.label}
              autoComplete={field.disabledAutoComplete ? 'no-complete' : 'on'}
              submitFailed={submitFailed}
              disabled={field.disabled}
              defaultDate={field.defaultDate}
              normalize={getNormalizing(field)} // when editing
              className={field.component === 'input' || !field.component ? 'input' : ''}
              {...field}
            />
            {field.hintBanner}
          </div>
        );
      })}
    </div>
  );
};
