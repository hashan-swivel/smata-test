import React, { useState, useEffect } from 'react';
import { Form, reduxForm, autofill, reset } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import * as moment from 'moment';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { postAlert } from '../../../../actions/alerts';
import { Fields } from '../../Form';
import { DollarInput } from '../../Form/Fields';
import { validate } from '../Header/validate';
import { axiosInstance, userOptionObj, stripInput } from '../../../../utils';
import Accordion from '../../DMS/InvoiceView/Accordion';

import '../../DMS/InvoiceView/Accordion.module.scss';
import './InvoiceRulesTabPanelContent.module.scss';

const InvoiceRulesTabPanelContent = ({
  buildingProfile,
  handleSubmit,
  pristine,
  submitting,
  submitFailed,
  closeModal,
  organisationUsers,
  setFormData,
  formData = {},
  buildingProfileHistories,
  viewOnly,
  isStrataMember,
  updateBuildingProfileHistories
}) => {
  const [stampRequired, setStampRequired] = useState(formData.oneOffStampRequired || false);
  const [oneOffInt, setOneOffInt] = useState(formData.oneOffIntRequired || true);
  const [oneOffExt, setOneOffExt] = useState(formData.oneOffExtRequired || false);
  const contacts = useSelector((state) => state.buildingProfile.contacts);
  const spNumber = buildingProfile.site_plan_id;
  const { values, syncErrors } = useSelector((state) => state.form.buildingRules);
  const dispatch = useDispatch();

  const oneOffIntAmountLabel = () => (
    <>
      <span style={{ marginRight: '5px' }}>Total amount is greater than or equal to</span>
      <Tooltip
        arrow
        title='Invoices with a total greater than or equal to this amount require approval by the internal approvers. If total is less than this amount, only the first approver is required to approve the invoice'
        position='left'
        animation='fade'
        theme='light'
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tooltip>
    </>
  );

  const oneOffIntApprovalLabel = () => (
    <>
      <span style={{ marginRight: '5px' }}>Internal approval required by</span>
      <Tooltip
        arrow
        title='Internal approvers will be assigned the invoice to approve'
        position='left'
        animation='fade'
        theme='light'
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tooltip>
    </>
  );

  const oneOffExtAmountLabel = () => (
    <>
      <span style={{ marginRight: '5px' }}>Total amount is greater than or equal to</span>
      <Tooltip
        arrow
        title='Invoices with a total greater than or equal to this amount require approval by the external approvers. If total is less than this amount, only the internal approver/s are required to approve the invoice'
        position='left'
        animation='fade'
        theme='light'
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tooltip>
    </>
  );

  const oneOffExtApprovalLabel = () => (
    <>
      <span style={{ marginRight: '5px' }}>External approval required by</span>
      <Tooltip
        arrow
        title='External approvers will be assigned the invoice to approve after the internal approvers'
        position='left'
        animation='fade'
        theme='light'
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tooltip>
    </>
  );

  const requiredExternallyApprovalLabel = () =>
    oneOffExt ? (
      <div className='alert alert--danger' style={{ marginTop: '20px' }}>
        Only Active & Invited contacts can be added as approvers. If the required approvers are not
        available in the dropdown, please invite them to the Portal.
      </div>
    ) : null;

  const oneOffFields = (fieldProps, disabled) => [
    {
      name: 'oneOffStampRequired',
      label:
        'Invoices Required to be stamped by Building Manager / Committee Prior to being processed',
      component: 'toggle',
      onChange: setStampRequired,
      checked: stampRequired,
      noLabel: true,
      disabled
    },
    {
      name: 'oneOffIntRequired',
      label: 'Require internal approval',
      component: 'toggle',
      onChange: setOneOffInt,
      checked: oneOffInt,
      noLabel: true,
      disabled
    },
    {
      name: 'oneOffIntAmount',
      label: oneOffIntAmountLabel(),
      component: DollarInput,
      classNames: oneOffInt ? 'rules-active' : 'rules-inactive',
      disabled
    },
    {
      name: 'oneOffIntApproval',
      label: oneOffIntApprovalLabel(),
      component: 'react-select',
      userList: true,
      isMulti: true,
      options: organisationUsers ? organisationUsers.map((user) => userOptionObj(user)) : [],
      classNames: oneOffInt ? 'rules-active' : 'rules-inactive',
      disabled
    },
    {
      name: 'oneOffIntFirst',
      label: 'First approver',
      component: 'react-select',
      userList: true,
      isMulti: false,
      options: organisationUsers ? organisationUsers.map((user) => userOptionObj(user)) : [],
      classNames: oneOffInt ? 'rules-active' : 'rules-inactive',
      disabled
    },
    {
      name: 'oneOffExtRequired',
      label: 'Require external approval',
      component: 'toggle',
      hintBanner: requiredExternallyApprovalLabel(),
      onChange: setOneOffExt,
      checked: oneOffExt,
      noLabel: true,
      disabled
    },
    {
      name: 'oneOffExtAmount',
      label: oneOffExtAmountLabel(),
      component: DollarInput,
      classNames: oneOffExt ? 'rules-active' : 'rules-inactive',
      disabled
    },
    {
      name: 'amountToApprove',
      label: 'Number of external voters required to approve',
      component: 'input',
      type: 'number',
      placeholder: 'Please enter a number',
      classNames: oneOffExt ? 'rules-active' : 'rules-inactive',
      disabled
    },
    {
      name: 'oneOffExtApproval',
      label: oneOffExtApprovalLabel(),
      component: 'react-select',
      userList: true,
      isMulti: true,
      options: contacts
        ? contacts.filter((contact) => contact.user_id).map((u) => userOptionObj(u))
        : [],
      classNames: oneOffExt ? 'rules-active' : 'rules-inactive',
      disabled
    }
  ];

  // Update the rules
  const onSubmit = async () => {
    await axiosInstance
      .put(`/v1/building_profile/${encodeURIComponent(spNumber)}`, {
        one_off_stamp_required: values.oneOffStampRequired,
        one_off_invoices_internal: stripInput(values.oneOffIntAmount),
        one_off_invoices_external: stripInput(values.oneOffExtAmount),
        external_approvers_needed: values.amountToApprove || 0,
        first_approver_attributes: {
          id: Array.isArray(values?.oneOffIntFirst)
            ? values?.oneOffIntFirst[0]?.id
            : values?.oneOffIntFirst?.id
        },
        internal_approver_ids: values?.oneOffIntApproval?.map((u) => u.id),
        external_approver_ids: values?.oneOffExtApproval?.map((u) => u.id)
      })
      .then(() => {
        setFormData(values);
        updateBuildingProfileHistories();
        closeModal();
        dispatch(postAlert(`You have updated the building rules`, 'success'));
      })
      .catch((error) => dispatch(postAlert(`${error.response.data.message}`, 'error')));
  };

  useEffect(() => {
    // Check for prepopulated data
    const prepopulatedData = Object.entries(formData);

    // Autofill each field with prepopulated data
    prepopulatedData.forEach((data) => {
      const [field, value] = data;
      dispatch(autofill('buildingRules', field, value));
    });
    // Reset form state on clean up
    return () => dispatch(reset('buildingRules'));
  }, []);

  // Checking if the selected first approver is removed from the approvers list
  useEffect(() => {
    const { oneOffIntApproval: internalApprovers, oneOffIntFirst: firstApprover } = values;
    // If there are internal approvers
    if (internalApprovers && firstApprover) {
      // Filter the approvers list and try and find the selected first approver
      const firstApproverIncluded = internalApprovers.filter(
        (approver) =>
          approver.id === (Array.isArray(firstApprover) ? firstApprover[0].id : firstApprover.id)
      );
      // If the selected first approver is not found within the approvers list
      if (firstApproverIncluded.length === 0) {
        // Reset the value of the first approver
        values.oneOffIntApproval = internalApprovers.concat(firstApprover);
        dispatch(autofill('buildingRules', 'oneOffIntApproval', values.oneOffIntApproval));
      }
    }
  }, [values]);

  // Clear relevant form fields when toggle field is set to false
  useEffect(() => {
    if (!oneOffInt) {
      dispatch(autofill('buildingRules', 'oneOffIntApproval', []));
      dispatch(autofill('buildingRules', 'oneOffIntAmount', null));
    }
    if (!oneOffExt) {
      dispatch(autofill('buildingRules', 'oneOffExtApproval', []));
      dispatch(autofill('buildingRules', 'oneOffExtAmount', null));
      dispatch(autofill('buildingRules', 'amountToApprove', null));
    } else if (values.amountToApprove === null || values.amountToApprove === undefined) {
      dispatch(autofill('buildingRules', 'amountToApprove', 1));
    }
  }, [oneOffInt, oneOffExt]);

  const canEdit = !isStrataMember && !viewOnly;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className='alert alert--info'>
        Invoice approval rules determine the workflow of invoice approvals.
      </div>
      {!isStrataMember && (
        <div className='alert alert--danger'>
          Updating the approvers in the building rules will reset the approval process for all
          invoices (excluding invoices Processing or Approved for payment)
        </div>
      )}
      {isStrataMember && (
        <div className='alert alert--danger'>
          You are not able to adjust these rules. Please contact your strata manager
        </div>
      )}
      <Fields
        fields={oneOffFields(values, !canEdit)}
        values={values}
        containerClass='one-off-fields'
        submitFailed={submitFailed}
        syncErrors={syncErrors}
      />
      <>
        <Accordion title='History:'>
          <div className='building-rule-view-block-content'>
            <ul className='building-rule-history-list ul'>
              {buildingProfileHistories &&
                buildingProfileHistories.map((item, index) => (
                  <li
                    key={`${index.toString()}-${item.created_at}`}
                    className='building-rule-history-item'
                  >
                    <span className='building-rule-history-item-date'>
                      <strong>{moment(item.created_at, 'X').format('DD MMM YY')}</strong>
                    </span>
                    <span className='building-rule-history-item-message'>{item.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        </Accordion>
      </>
      {canEdit && (
        <div className='rules-button-container'>
          <button type='button' className='button secondary rules-close' onClick={closeModal}>
            Close
          </button>
          <button
            type='submit'
            disabled={pristine || submitting}
            className='button primary rules-done'
          >
            Done
          </button>
        </div>
      )}
    </Form>
  );
};

export default reduxForm({
  form: 'buildingRules',
  initialValues: {
    amountToApprove: 1
  },
  validate
})(InvoiceRulesTabPanelContent);
