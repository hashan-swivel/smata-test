import React from 'react';
import Select, { components } from 'react-select';
import { Field } from 'redux-form';
import Creatable from 'react-select/creatable';
import { ValidationError } from '../ValidationError';
import { Avatar } from '../../Avatar';

import './ReactSelect.module.scss';

const MultiValueLabel = ({ children, ...props }) => {
  const { data } = props;
  const { fullName, full_name } = data;

  return (
    <components.MultiValueLabel {...props}>
      <div className='react-select-user-label'>
        <Avatar {...data} size='tiny' />
        {fullName || full_name}
      </div>
    </components.MultiValueLabel>
  );
};

const MultiValueRemove = ({ children, ...props }) => {
  const { data } = props;

  return (
    <components.MultiValueRemove {...props}>
      {data?.isFixed ? <span /> : children}
    </components.MultiValueRemove>
  );
};

const SingleValue = ({ children, ...props }) => {
  const { data } = props;
  const { fullName, full_name } = data;

  return (
    <components.SingleValue {...props}>
      <div className='react-select-user-label'>
        <Avatar {...data} size='tiny' />
        {fullName || full_name}
      </div>
    </components.SingleValue>
  );
};

const Option = ({ data, ...props }) => {
  const {
    fullName,
    firstName,
    lastName,
    role,
    approved,
    inProcess,
    approver_type: approverType
  } = data;

  return (
    <components.Option className={`${inProcess && approved && 'disabled'}`} {...props}>
      <div className='react-select-avatar-name'>
        <Avatar {...data} size='tiny' />
        {fullName || [firstName, lastName].filter((e) => e !== null && e !== '').join(' ')}
      </div>
      {role && <span className='react-select-user-role'>{role.replace(/_/g, ' ')}</span>}
      {approverType && (
        <span className='react-select-user-role'>
          {approverType.charAt(0).toUpperCase() + approverType.slice(1)}
        </span>
      )}
      {approved && <div className={`${approved && 'react-select-approved'}`} />}
    </components.Option>
  );
};

export const ReactSelect = (props) => {
  const {
    input,
    name,
    options,
    filterOption,
    placeholder = 'Select...',
    disabled,
    loading,
    errors,
    submitFailed,
    classNames,
    selectedOption,
    isMulti,
    userList,
    noOptionsMessagefunction,
    canCreateOptions,
    onChange,
    prepopulated,
    menuPortalTarget,
    inProcess,
    defaultValue,
    onInputChange,
    onMenuScrollToBottom,
    closeMenuOnSelect
  } = props;
  const SelectComponent = canCreateOptions ? Creatable : Select;

  const handleChange = (value, { action, removedValue }) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue?.isFixed) {
          return;
        }
        break;
      case 'clear':
        value = selectedOption.filter((v) => v?.isFixed);
        break;
    }

    input.onChange(value);
  };

  return (
    <div
      className={classNames ? `field react-select-field ${classNames}` : 'field react-select-field'}
    >
      <ValidationError submitFailed={submitFailed} errors={errors} field={name} />
      <Field component='input' name={name || input.name} type='hidden' />
      <SelectComponent
        classNamePrefix='react-select'
        options={options}
        filterOption={filterOption}
        value={prepopulated || selectedOption || ''}
        placeholder={placeholder}
        menuPortalTarget={menuPortalTarget}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        components={userList ? { Option, MultiValueLabel, SingleValue, MultiValueRemove } : {}}
        onChange={onChange || handleChange}
        isDisabled={disabled || loading}
        isMulti={isMulti}
        onInputChange={onInputChange}
        onMenuScrollToBottom={onMenuScrollToBottom}
        noOptionsMessagefunction={noOptionsMessagefunction || null}
        isOptionDisabled={(option) => (option.approved === 'true' && inProcess) || option.disabled}
        defaultValue={defaultValue}
        closeMenuOnSelect={closeMenuOnSelect}
        blurInputOnSelect
        isClearable={
          Array.isArray(selectedOption) && selectedOption.some((v) => !v?.isFixed) && isMulti
        }
      />
    </div>
  );
};
