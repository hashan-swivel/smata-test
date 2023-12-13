import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faExclamationTriangle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray, autofill } from 'redux-form';
import { Tooltip } from 'react-tippy';
import { Fields } from '../../Form';
import Accordion from './Accordion';
import { invoiceConstants } from '../../../../constants';
import { currencyFormat, gstCalculator } from '../../../../utils';

import './RowItems.module.scss';

const getTotalsFromRowItems = (rowItems) => {
  if (!rowItems || rowItems.length === 0) return { total: 0, gst: 0 };

  const total = rowItems.reduce((a, b) => a + parseFloat(b.amount || 0), 0);
  const gst = rowItems.reduce((a, b) => a + parseFloat(b.gst || 0), 0);
  return { total, gst };
};

const fields = (
  index,
  glCode,
  recentGlCodes,
  adminGlCodes,
  cwfGlCodes,
  allGlCodes,
  groupCode,
  groupCodes,
  gstRegistered,
  onRowItemAmountChange
) => {
  const glOptionsRecent = [];
  const glOptionsAdmin = [];
  const glOptionsCwf = [];
  const glOptionsOther = [];
  const groupOptions = [];
  const sortGlCodes = (a, b) => a?.label?.localeCompare(b?.label);

  const formatOptions = (inputArray, outputArray) => {
    if (inputArray) {
      inputArray.forEach((item) =>
        outputArray.push({ value: item.id, label: item.full_name || item.name })
      );
    }
  };

  formatOptions(recentGlCodes, glOptionsRecent);
  formatOptions(adminGlCodes, glOptionsAdmin);
  formatOptions(cwfGlCodes, glOptionsCwf);
  formatOptions(allGlCodes, glOptionsOther);
  formatOptions(groupCodes, groupOptions);

  return [
    {
      name: `rowItems[${index}].glCode`,
      label: 'GL Code',
      component: 'react-select',
      classNames: 'row-glcode',
      placeholder: 'GL Code',
      options: [
        { label: 'Recenty used for this plan/service provider', options: glOptionsRecent },
        { label: 'Admin Fund Codes', options: glOptionsAdmin.sort(sortGlCodes) },
        { label: 'CWF Fund Codes', options: glOptionsCwf.sort(sortGlCodes) },
        { label: 'All Expense Codes', options: glOptionsOther.sort(sortGlCodes) }
      ],
      prepopulated:
        typeof glCode === 'object'
          ? glCode
          : glOptionsAdmin
              .concat(glOptionsCwf)
              .concat(glOptionsOther)
              .find((o) => o.value === glCode)
    },
    {
      name: `rowItems[${index}].description`,
      label: 'Description',
      component: 'input',
      type: 'text',
      classNames: 'row-description',
      maxLength: invoiceConstants.INVOICE_DESCRIPTION_MAXLENGTH,
      isNormalize: true
    },
    {
      name: `rowItems[${index}].amount`,
      label: 'Amount',
      component: 'input',
      type: 'number',
      classNames: 'row-amount',
      onChange: (e) => onRowItemAmountChange(index, e.target.value)
    },
    {
      name: `rowItems[${index}].gst`,
      label: 'GST',
      component: 'input',
      type: 'number',
      classNames: 'row-gst',
      disabled: !gstRegistered
    },
    {
      name: `rowItems[${index}].group`,
      label: 'Group',
      component: 'react-select',
      classNames: 'row-group',
      placeholder: 'Group',
      options: groupOptions,
      prepopulated:
        typeof groupCode === 'object' ? groupCode : groupOptions.find((o) => o.value === groupCode)
    }
  ];
};

const getTitleFromCode = (code) => {
  switch (code) {
    case 'glCodeValue':
      return 'GL Code';
    case 'description':
      return 'Description';
    case 'gst':
      return 'GST';
    case 'amount':
      return 'Amount';
    case 'groupCodeValue':
      return 'Group';
    default:
      return '';
  }
};

export const RowItems = (props) => {
  const { values, editing } = props;

  if (!editing && (!values || !values.length)) return null;

  return (
    <Accordion title='Row Items:'>
      <div className='document-view-block-content'>
        <RowItemsBody {...props} />
      </div>
    </Accordion>
  );
};

const RowItemsBody = ({
  editing,
  values = [],
  recentGlCodes = [],
  adminGlCodes = [],
  cwfGlCodes = [],
  allGlCodes = [],
  groupCodes,
  setDeleteRowIds,
  syncErrors,
  submitFailed,
  formName,
  jobTitle,
  jobTradeGlCode,
  invoiceDetails,
  currentUser
}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form[formName]);
  const gstRegistered = useMemo(() => {
    const { creditor } = formState.values;
    return creditor?.gstRegistered === true || creditor?.gstRegistered === 'Yes';
  }, [formState.values.creditor?.gstRegistered]);

  const [isGstRegistered, setIsGstRegistered] = useState(gstRegistered);
  const glCodes = [
    ...(recentGlCodes || []),
    ...(cwfGlCodes || []),
    ...(adminGlCodes || []),
    ...(allGlCodes || [])
  ];

  const defaultGlDesc = formState.values.creditor?.defaultDescription;
  const defaultGlCode = formState.values.creditor?.defaultGlCodeId;

  // Autofill gl code React select
  useEffect(() => {
    values.forEach((value, index) => {
      if (value.glCode) {
        const glCodeObj = glCodes?.find((glCode) => glCode.id === value.glCode);
        if (glCodeObj) {
          dispatch(
            autofill(formName, `rowItems[${index}].glCode`, {
              value: glCodeObj.id,
              label: glCodeObj.full_name
            })
          );
        }
      }

      if (value.group) {
        const groupObj = groupCodes?.find((groupCode) => groupCode.id === value.group);

        if (groupObj) {
          dispatch(
            autofill(formName, `rowItems[${index}].group`, {
              value: groupObj.id,
              label: groupObj.name
            })
          );
        }
      }
    });
  }, [values, groupCodes]);

  useEffect(() => {
    const hasRows = values && values.length > 0;
    const gstStatusChanged = isGstRegistered !== gstRegistered;
    // Work out GST for each row by check if the value or GST status has changed
    if (hasRows && gstStatusChanged) {
      values.forEach((value, index) => {
        if (!gstRegistered && value.gst !== 0) {
          dispatch(autofill(formName, `rowItems[${index}].gst`, 0));
          if (isGstRegistered) setIsGstRegistered(false);
        }
      });
    }
  }, [gstRegistered]);

  const rowItemError = submitFailed && syncErrors && syncErrors.rowItems;

  if (editing) {
    return (
      <div
        className={`row-items-fields-container ${rowItemError ? 'editing-fields-row-items' : ''}`}
      >
        <FieldArray
          name='rowItems'
          values={values}
          recentGlCodes={recentGlCodes}
          adminGlCodes={adminGlCodes}
          cwfGlCodes={cwfGlCodes}
          allGlCodes={allGlCodes}
          groupCodes={groupCodes}
          setDeleteRowIds={setDeleteRowIds}
          component={RenderFieldItems}
          submitFailed={submitFailed}
          syncErrors={syncErrors}
          editFailed={submitFailed}
          gstRegistered={gstRegistered !== false}
          formName={formName}
          jobTitle={jobTitle}
          jobTradeGlCode={jobTradeGlCode}
          invoiceDetails={invoiceDetails}
          currentUser={currentUser}
          defaultGlDesc={defaultGlDesc}
          defaultGlCode={defaultGlCode}
        />
      </div>
    );
  }

  return (
    <div className='row-items-fields-container'>
      {values.map((item, index) => {
        const {
          id,
          glCode,
          glCodePrefix,
          description,
          gst: unformattedGst,
          amount: unformattedAmount,
          group
        } = item;
        const foundGlCode = glCode?.value
          ? glCodes.find((glItem) => glItem.id === glCode?.value)
          : glCodes.find((glItem) => glItem.id === glCode);

        const glCodeValue = foundGlCode
          ? [glCodePrefix, foundGlCode.full_name].filter((x) => !!x).join(' - ')
          : 'N/A';

        const foundGroupCode = group?.value
          ? groupCodes?.find((groupItem) => groupItem.id === group?.value)
          : groupCodes?.find((groupItem) => groupItem.id === group);

        const groupCodeValue = foundGroupCode ? foundGroupCode.name : 'N/A';

        const gst = currencyFormat(unformattedGst);
        const amount = currencyFormat(unformattedAmount);

        return (
          <div key={id || `${glCode}-${index}`}>
            <div className='fields row-items-container'>
              {Object.entries({ glCodeValue, description, amount, gst, groupCodeValue }).map(
                (rowItem, rowItemIndex) => (
                  <div className={`field row-${rowItem[0]}`} key={rowItem[0]}>
                    <div className='fieldtitle'>
                      <label>{getTitleFromCode(rowItem[0])}</label>
                    </div>
                    <span className={`row-item${rowItemIndex} row-title`}>{rowItem[1]}</span>
                  </div>
                )
              )}
            </div>

            {index < values.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
};

const RenderFieldItems = (props) => {
  const {
    fields: reduxFormFields,
    values,
    setDeleteRowIds,
    syncErrors,
    editFailed,
    recentGlCodes,
    adminGlCodes,
    cwfGlCodes,
    allGlCodes,
    groupCodes,
    gstRegistered,
    formName,
    jobTitle,
    jobTradeGlCode,
    invoiceDetails,
    defaultGlDesc,
    defaultGlCode,
    currentUser
  } = props;

  const dispatch = useDispatch();
  const selectedGlCode = allGlCodes?.find(
    (i) => i.id === (jobTradeGlCode === undefined ? defaultGlCode : jobTradeGlCode)
  );
  const { invoiceAmount, invoiceGst } = invoiceDetails;

  const defaultSelectedGroupCode = () => {
    if (groupCodes?.length === 1) {
      return { value: groupCodes[0].id, label: groupCodes[0].name };
    }

    if (groupCodes?.length > 1) {
      const noneGroupCode = groupCodes.find((g) => g.name?.toLowerCase() === 'none');

      if (noneGroupCode) {
        return { value: noneGroupCode.id, label: noneGroupCode.name };
      }
    }

    return null;
  };

  const newRowItem = {
    glCode: selectedGlCode ? { value: selectedGlCode.id, label: selectedGlCode.name } : null,
    description:
      jobTradeGlCode === undefined
        ? defaultGlDesc?.substring(0, invoiceConstants.INVOICE_DESCRIPTION_MAXLENGTH)
        : jobTitle?.substring(0, invoiceConstants.INVOICE_DESCRIPTION_MAXLENGTH),
    amount: invoiceAmount,
    gst: invoiceGst,
    group: defaultSelectedGroupCode()
  };

  const onRowItemAmountChange = (index, value) => {
    let gstAmount = 0;
    if (gstRegistered && value.length !== 0)
      gstAmount = gstCalculator(value, gstRegistered, currentUser?.country);
    dispatch(autofill(formName, `rowItems[${index}].gst`, gstAmount));
  };

  useEffect(() => {
    values.forEach((value, index) => {
      if (groupCodes && (value?.group === null || value?.group === undefined)) {
        const selectedGroup = value?.group || defaultSelectedGroupCode();
        if (selectedGroup) dispatch(autofill(formName, `rowItems[${index}].group`, selectedGroup));
      }
    });
  }, []);

  const { total, gst } = getTotalsFromRowItems(values);

  const totalAmount = parseFloat(total).toFixed(2);
  const totalGST = parseFloat(gst).toFixed(2);

  return (
    <>
      {values.map((value, index) => {
        const { id, glCode, group } = value;

        return (
          <div key={id || `${glCode}-${index}`}>
            <div className='editing-fields'>
              <div style={{ textAlign: 'right' }}>
                <button
                  type='button'
                  className='item-button remove-item-button icon icon-cross-red'
                  onClick={() => {
                    if (id) {
                      setDeleteRowIds((prevState) => [...prevState, id]);
                    }
                    reduxFormFields.remove(index);
                  }}
                />
              </div>
              <Fields
                containerClass='row-items-container'
                fields={fields(
                  index,
                  glCode,
                  recentGlCodes,
                  adminGlCodes,
                  cwfGlCodes,
                  allGlCodes,
                  group,
                  groupCodes,
                  gstRegistered,
                  onRowItemAmountChange
                )}
                values={values}
                syncErrors={syncErrors}
                submitFailed={editFailed}
              />
            </div>
            <hr />
          </div>
        );
      })}

      <div>
        <div className='fields row-items-container'>
          <div className='field row-amount'>
            <div className='fieldtitle'>
              <label>Total Amount</label>
              {parseFloat(totalAmount) !== parseFloat(invoiceAmount) && (
                <Tooltip
                  arrow
                  title='Total amount does not match the invoice amount'
                  position='bottom'
                  animation='fade'
                  theme='light'
                >
                  &nbsp; <FontAwesomeIcon icon={faExclamationTriangle} size='sm' color='red' />
                </Tooltip>
              )}
            </div>
            <div className='field'>
              <span
                className={
                  parseFloat(totalAmount) !== parseFloat(invoiceAmount) ? 'text--danger' : null
                }
              >
                {currencyFormat(totalAmount)}
              </span>
            </div>
          </div>
          <div className='field row-gst'>
            <div className='fieldtitle'>
              <label>Total GST</label>
              {parseFloat(totalGST) !== parseFloat(invoiceGst) && (
                <Tooltip
                  arrow
                  title='Total GST amount does not match the invoice GST'
                  position='bottom'
                  animation='fade'
                  theme='light'
                >
                  &nbsp; <FontAwesomeIcon icon={faExclamationTriangle} size='sm' color='red' />
                </Tooltip>
              )}
            </div>
            <div className='field'>
              <span
                className={parseFloat(totalGST) !== parseFloat(invoiceGst) ? 'text--danger' : null}
              >
                {currencyFormat(totalGST)}
              </span>
            </div>
          </div>
          <div className='field row-group' style={{ display: 'block', textAlign: 'right' }}>
            <button
              type='button'
              className='button button--primary'
              onClick={() => reduxFormFields.push(newRowItem)}
            >
              <FontAwesomeIcon icon={faPlus} size='sm' color='white' />
              &nbsp; Add Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
