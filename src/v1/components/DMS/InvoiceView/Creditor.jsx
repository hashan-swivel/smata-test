import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { autofill, touch } from 'redux-form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faShieldAlt, faHardHat } from '@fortawesome/free-solid-svg-icons';
import { creditorConstants } from '../../../../constants';
import { axiosInstance, boolToString } from '../../../../utils';
import Accordion from './Accordion';

import './Creditor.module.scss';

const menuPortalTarget = typeof window !== 'undefined' ? document.getElementById('__next') : null;
const formName = 'invoiceForm';

const decoratedPaymentMethodOption = (val) => {
  if (val) {
    return {
      ...val,
      value: val.id,
      label: val.bpay_biller_code
        ? `${val.payment_method} (${val.bpay_biller_code})`
        : val.payment_method
    };
  }

  return null;
};

export const Creditor = ({ editing, attachment, spNumber, currentUser }) => {
  const strataMasterCreditor = attachment?.invoice?.strata_master_creditor;
  const contractor = attachment?.contractor;

  const initializedSelectedStrataMasterCreditor = strataMasterCreditor
    ? {
        ...strataMasterCreditor,
        label: strataMasterCreditor?.name,
        value: strataMasterCreditor?.id
      }
    : null;
  const initializedContractor = contractor?.id
    ? { ...contractor, label: contractor?.abn, value: contractor?.id }
    : null;
  const initializedPaymentMethod = strataMasterCreditor?.id
    ? decoratedPaymentMethodOption(strataMasterCreditor)
    : null;
  const initializedBpayCrn = attachment?.use_custom_bpay_crn
    ? { value: contractor?.bpay_crn, label: contractor?.bpay_crn, __isNew__: true }
    : attachment?.bpay_crn_id;

  const [selectedStrataMasterCreditor, setSelectedStrataMasterCreditor] = useState(
    initializedSelectedStrataMasterCreditor
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initializedPaymentMethod);
  const [selectedContractor, setSelectedContractor] = useState(initializedContractor);
  const [selectedBpayCrn, setSelectedBpayCrn] = useState(initializedBpayCrn);

  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [bpayCrnOptions, setBpayCrnOptions] = useState([]);

  const [strataMasterCreditorKey, setStrataMasterCreditorKey] = useState(
    'strataMasterCreditorsKey'
  );
  const [contractorKey, setContractorKey] = useState('contractorKey');
  const [reduxKey, setReduxKey] = useState('reduxKey');
  const [isFirstUpdate, setIsFirstUpdate] = useState(true);

  const dispatch = useDispatch();

  const initBpayCrn = (externalResourceId) => {
    setBpayCrnOptions([]);

    if (!externalResourceId) return;

    axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(spNumber)}/bpay_crns`, {
        params: { external_resource_id: externalResourceId }
      })
      .then((res) => {
        const bpayCrnsArr = res.data.bpay_crns;

        let newSelectedBpayCrn = null;
        let foundBpayCrn;

        if (typeof selectedBpayCrn === 'number') {
          foundBpayCrn = bpayCrnsArr.find((b) => b.id === selectedBpayCrn);
        } else {
          foundBpayCrn = bpayCrnsArr.find((b) => b.id === selectedBpayCrn?.value);
        }

        if (foundBpayCrn) {
          newSelectedBpayCrn = { value: foundBpayCrn.id, label: foundBpayCrn.crn };
        } else if (selectedBpayCrn?.__isNew__) {
          newSelectedBpayCrn = selectedBpayCrn;
        } else if (editing && bpayCrnsArr.length === 1) {
          newSelectedBpayCrn = { value: bpayCrnsArr[0].id, label: bpayCrnsArr[0].crn };
        }

        handleSelectedBpayCrnChanged(newSelectedBpayCrn);
        setBpayCrnOptions(bpayCrnsArr.map((crn) => ({ label: crn.crn, value: crn.id })));
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (reduxKey.length !== 0) {
      dispatch(
        autofill(formName, 'creditor.paymentMethod', selectedStrataMasterCreditor?.payment_method)
      );
      dispatch(
        autofill(
          formName,
          'creditor.contractorExternalId',
          selectedStrataMasterCreditor?.external_id
        )
      );
      dispatch(
        autofill(
          formName,
          'creditor.bpayBillerCode',
          selectedStrataMasterCreditor?.bpay_biller_code
        )
      );
      dispatch(
        autofill(
          formName,
          'creditor.gstRegistered',
          currentUser?.country === 'NZ'
            ? selectedStrataMasterCreditor?.gst_registered
            : selectedContractor?.gst_registered
        )
      );
      dispatch(
        autofill(formName, 'creditor.abn', {
          label: selectedContractor?.abn,
          value: selectedContractor?.abn
        })
      );
      dispatch(
        autofill(
          formName,
          'creditor.defaultDescription',
          selectedStrataMasterCreditor?.default_description
        )
      );
      dispatch(
        autofill(
          formName,
          'creditor.defaultGlCodeId',
          selectedStrataMasterCreditor?.default_gl_code_id
        )
      );
      dispatch(
        autofill(
          formName,
          'creditor.creditorName',
          selectedContractor
            ? {
                label: selectedContractor.name,
                value: selectedContractor.id,
                name: selectedContractor.name,
                id: selectedContractor.id
              }
            : null
        )
      );

      if (isFirstUpdate) {
        setIsFirstUpdate(false);
      } else {
        dispatch(touch(formName, 'creditor'));
      }
    }
  }, [reduxKey]);

  const loadPaymentMethods = async (contractor_id) => {
    if (contractor_id === undefined || contractor_id === null) {
      setPaymentMethodOptions([]);
      return;
    }

    const params = { organisation_id: currentUser?.organisation_id, contractor_id };

    await axiosInstance
      .get(creditorConstants.STRATA_MASTER_CREDITOR_BASE_PATH, { params })
      .then((res) =>
        setPaymentMethodOptions(res.data.creditors.map((c) => decoratedPaymentMethodOption(c)))
      )
      .catch(() => setPaymentMethodOptions([]));
  };

  const loadStrataMasterCreditors = (inputValue, callback) => {
    setTimeout(() => {
      const params = {
        organisation_id: currentUser?.organisation_id,
        q: inputValue?.length > 0 ? inputValue : null,
        contractor_id: selectedContractor ? selectedContractor.value : null
      };

      axiosInstance
        .get(creditorConstants.STRATA_MASTER_CREDITOR_BASE_PATH, { params })
        .then((res) => callback(res.data.creditors))
        .catch(() => callback([]));
    }, 800);
  };

  const loadContractors = (inputValue, callback) => {
    setTimeout(() => {
      const params = {
        organisation_id: currentUser?.organisation_id,
        search: inputValue?.length > 0 ? inputValue : null
      };

      axiosInstance
        .get(creditorConstants.BASE_PATH, { params })
        .then((res) =>
          callback(res.data.contractors.map((c) => ({ ...c, value: c.id, label: c.abn })))
        )
        .catch(() => callback([]));
    }, 800);
  };

  useEffect(() => {
    if (editing) {
      loadPaymentMethods(selectedContractor?.id);
      initBpayCrn(selectedStrataMasterCreditor?.id);
    }
  }, [editing]);

  const handleSelectedStrataMasterCreditorChanged = (value) => {
    setSelectedStrataMasterCreditor(value);
    setSelectedPaymentMethod(decoratedPaymentMethodOption(value));

    if (value?.contractor) {
      setSelectedContractor({
        ...value?.contractor,
        value: value?.contractor.id,
        label: value?.contractor.abn
      });
    } else {
      setSelectedContractor(null);
      setStrataMasterCreditorKey(`strataMasterCreditorsKey_${Date.now()}`);
    }

    loadPaymentMethods(value?.contractor?.id);
    initBpayCrn(value?.id);
    setContractorKey(`contractorKey_${Date.now()}`);
    setReduxKey(`setReduxKey_${Date.now()}`);
  };

  const handleSelectedContractorChanged = (value) => {
    setSelectedContractor(value);

    if (value?.strata_master_creditors && value?.strata_master_creditors?.length === 1) {
      const creditor = value.strata_master_creditors[0];
      setSelectedStrataMasterCreditor({ ...creditor, value: creditor.id, label: creditor.name });
      setSelectedPaymentMethod(decoratedPaymentMethodOption(creditor));
    } else {
      setSelectedPaymentMethod(null);
      setSelectedStrataMasterCreditor(null);
    }

    loadPaymentMethods(value?.id);
    setStrataMasterCreditorKey(`strataMasterCreditorsKey_${Date.now()}`);
    setReduxKey(`setReduxKey_${Date.now()}`);
  };

  const handleSelectedPaymentMethod = (value) => {
    setSelectedPaymentMethod(value);

    if (value) {
      setSelectedStrataMasterCreditor({ ...value, label: value?.name });

      if (value?.contractor) {
        setSelectedContractor({
          ...value?.contractor,
          value: value?.contractor.id,
          label: value?.contractor.abn
        });
      } else {
        setSelectedContractor(null);
      }
    } else {
      setSelectedContractor(null);
      setSelectedStrataMasterCreditor(null);
      setContractorKey(`contractorKey_${Date.now()}`);
      setStrataMasterCreditorKey(`strataMasterCreditorsKey_${Date.now()}`);
    }

    setReduxKey(`setReduxKey_${Date.now()}`);
  };

  const handleSelectedBpayCrnChanged = (value) => {
    setSelectedBpayCrn(value);
    dispatch(autofill(formName, 'creditor.bpayCrn', value));
  };

  const alert = () => {
    if (
      !editing &&
      currentUser?.isTenantManager &&
      contractor?.id &&
      !contractor?.active_external_resource_organisation_ids?.includes(currentUser?.organisation_id)
    ) {
      return (
        <div className='alert alert--danger text--center' style={{ fontSize: '95%' }}>
          <strong>This creditor does not exist in your Strata Master database.</strong>
          <br />
          <span>
            You cannot approve this invoice until they are added. Once added the creditor will
            updated automatically within 10 minutes.
          </span>
        </div>
      );
    }
  };

  const strataMasterNameField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='strataMasterName'>Strata Master Creditor Name</label>
      </div>
      <div className='form__control'>
        {editing ? (
          <AsyncSelect
            isClearable
            key={strataMasterCreditorKey}
            value={selectedStrataMasterCreditor}
            loadOptions={loadStrataMasterCreditors}
            defaultOptions
            onChange={(value) => handleSelectedStrataMasterCreditorChanged(value)}
            name='strataMasterName'
            classNamePrefix='react-select'
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={menuPortalTarget}
            placeholder='Name, emails, bsb, account no...'
          />
        ) : (
          <span>{strataMasterCreditor?.name || 'N/A'}</span>
        )}
      </div>
    </div>
  );

  const businessNumberField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='businessNumber'>Business Number</label>
      </div>
      <div className='form__control'>
        {editing ? (
          <AsyncSelect
            isClearable
            key={contractorKey}
            value={selectedContractor}
            loadOptions={loadContractors}
            defaultOptions
            onChange={(val) => handleSelectedContractorChanged(val)}
            name='businessNumber'
            classNamePrefix='react-select'
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={menuPortalTarget}
            placeholder='Business number...'
          />
        ) : (
          <span>{contractor?.abn || 'N/A'}</span>
        )}
      </div>
    </div>
  );

  const paymentMethodField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='paymentMethod'>Payment Method</label>
      </div>
      <div className='form__control'>
        {editing ? (
          <Select
            isClearable
            options={paymentMethodOptions}
            value={selectedPaymentMethod}
            onChange={(val) => handleSelectedPaymentMethod(val)}
            name='paymentMethod'
            id='payment-method'
            classNamePrefix='react-select'
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={menuPortalTarget}
            placeholder='Payment methods...'
          />
        ) : (
          <span>{strataMasterCreditor?.payment_method || 'N/A'}</span>
        )}
      </div>
    </div>
  );

  const gstRegisteredField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='gstRegistered'>Registered for GST</label>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='gstRegistered'
          id='gst-registered'
          disabled
          value={boolToString(selectedContractor?.gst_registered) || ''}
        />
      ) : (
        <div className='form__control'>
          <span>{boolToString(contractor?.gst_registered, 'N/A')}</span>
        </div>
      )}
    </div>
  );

  const strataMasterGstRegisteredField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='strataMasterGstRegisteredField'>Registered for GST</label>{' '}
        <Tooltip
          arrow
          title='The GST status matches the information for the Creditor in Strata Master. To change this, please update the creditor information in Strata Master'
          position='top'
          animation='fade'
          theme='light'
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </Tooltip>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='gstRegistered'
          id='gst-registered'
          disabled
          value={boolToString(selectedStrataMasterCreditor?.gst_registered) || ''}
        />
      ) : (
        <div className='form__control'>
          <span>{boolToString(strataMasterCreditor?.gst_registered, 'N/A')}</span>
        </div>
      )}
    </div>
  );

  const bsbField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='bsb'>BSB</label>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='bsb'
          id='bsb'
          disabled
          value={selectedStrataMasterCreditor?.bsb || ''}
        />
      ) : (
        <div className='form__control'>
          <span>{strataMasterCreditor?.bsb || 'N/A'}</span>
        </div>
      )}
    </div>
  );

  const accountNoField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='accountNo'>Account Number</label>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='accountNo'
          id='account-no'
          disabled
          value={selectedStrataMasterCreditor?.account_no || ''}
        />
      ) : (
        <div className='form__control'>
          <span>{strataMasterCreditor?.account_no || 'N/A'}</span>
        </div>
      )}
    </div>
  );

  const bpayBillerCodeField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='bpayBillerCode'>BPAY Biller Code</label>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='bpayBillerCode'
          id='bpay-biller-code'
          disabled
          value={selectedStrataMasterCreditor?.bpay_biller_code}
        />
      ) : (
        <div className='form__control'>
          <span>{strataMasterCreditor?.bpay_biller_code || 'N/A'}</span>
        </div>
      )}
    </div>
  );

  const bpayCrnField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='bpayCRN'>BPAY CRN</label>
      </div>
      <div className='form__control'>
        {editing ? (
          <CreatableSelect
            isDisabled={
              selectedStrataMasterCreditor?.payment_method !== creditorConstants.BPAY_PAYMENT_METHOD
            }
            name='bpayCRN'
            options={bpayCrnOptions}
            value={selectedBpayCrn}
            onChange={(value) => handleSelectedBpayCrnChanged(value)}
            classNamePrefix='react-select'
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={menuPortalTarget}
            placeholder={
              selectedPaymentMethod === creditorConstants.BPAY_PAYMENT_METHOD ? 'Select...' : null
            }
          />
        ) : (
          <span>{contractor?.bpay_crn || 'N/A'}</span>
        )}
      </div>
    </div>
  );

  const profileNameField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='profileName'>Contractor Profile Name</label>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='profileName'
          id='profile-name-field'
          disabled
          value={selectedContractor?.name || ''}
        />
      ) : (
        <div className='form__control'>
          <span>{contractor?.name || 'N/A'}</span>
        </div>
      )}
    </div>
  );

  const paymentEmailField = () => (
    <div className='form__group'>
      <div className='form__control'>
        <label htmlFor='paymentEmail'>Payment Email</label>
      </div>
      {editing ? (
        <input
          className='form__control'
          type='text'
          name='paymentEmail'
          id='payment-email'
          disabled
          value={selectedStrataMasterCreditor?.payments_email || ''}
        />
      ) : (
        <div className='form__control'>
          <span>{strataMasterCreditor?.payments_email || 'N/A'}</span>
        </div>
      )}
    </div>
  );

  const complianceItem = (item) => {
    if (item.type === 'insurance' || item.type === 'licence') {
      const title = `${
        item.type.charAt(0).toUpperCase() + item.type.slice(1)
      } - ${item.state.replace('_', ' ')}`;
      return (
        <div
          className={`compliance-status ${item.type}-status ${item.type}-status--${item.state}`}
          key={`${item.type}_${item.id}`}
        >
          <Tooltip arrow title={title} animation='fade' theme='light' duration='200'>
            {item.type === 'insurance' && <FontAwesomeIcon icon={faShieldAlt} />}
            {item.type === 'licence' && <FontAwesomeIcon icon={faHardHat} />}
            &nbsp;{item.name}
          </Tooltip>
        </div>
      );
    }

    if (item.type === 'strata_master') {
      return (
        <div
          className={`compliance-status strata-master-status strata-master-status--${item.state}`}
          key={`${item.type}_${item.id}`}
        >
          <Tooltip
            arrow
            title='Strata Master Compliance Status'
            animation='fade'
            theme='light'
            duration='200'
          >
            {item.name}
          </Tooltip>
        </div>
      );
    }
  };

  const complianceField = () => {
    if (
      !editing &&
      currentUser?.isTenantManager &&
      (currentUser?.feature_flags?.compliance ||
        currentUser?.feature_flags?.strata_master_compliance)
    ) {
      return (
        <div className='form__group' style={{ gridColumn: '1 / -1' }}>
          <div className='form__control'>
            <label htmlFor='compliance'>Compliance</label>
          </div>
          <div className='form__control'>
            {contractor?.compliance_items &&
              contractor?.compliance_items.slice(0, 5).map((i) => complianceItem(i))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (typeof editing === 'boolean') {
    return (
      <Accordion title='Creditor Details:'>
        <div className='document-view-block-content'>
          {alert()}
          <div className='creditor-fields'>
            {strataMasterNameField()}
            {businessNumberField()}
            {paymentMethodField()}
            {currentUser?.country === 'NZ'
              ? strataMasterGstRegisteredField()
              : gstRegisteredField()}
            {bsbField()}
            {accountNoField()}
            {bpayBillerCodeField()}
            {bpayCrnField()}
            {profileNameField()}
            {paymentEmailField()}
            {complianceField()}
          </div>
        </div>
      </Accordion>
    );
  }

  return null;
};
