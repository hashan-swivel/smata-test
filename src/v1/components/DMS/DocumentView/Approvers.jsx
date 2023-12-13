import React from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tippy';
import Accordion from '../InvoiceView/Accordion';
import { Avatar } from '../../index';
import ApproverExplanation from './ApproverExplanation';

import './SharedWith.module.scss';

export const Approvers = (props) => {
  const {
    editing,
    approvers,
    currentlyWith,
    id,
    invoiceAmountIsNoLessInt,
    invoiceAmountIsNoLessExt,
    openModal,
    setModalType,
    currentUser,
    buildingData
  } = props;

  const showModalType = (modalType) => {
    setModalType(modalType);
    openModal();
  };

  const title = (
    <>
      <span style={{ marginRight: '5px' }}>Approvers:</span>
      <Tooltip arrow html={ApproverExplanation()} position='bottom' animation='fade' theme='light'>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tooltip>
    </>
  );

  const isApproverRequired = (approver) => {
    if (approver.first_approver) return true;
    if (invoiceAmountIsNoLessInt && approver.approver_type === 'internal') return true;
    if (invoiceAmountIsNoLessExt && approver.approver_type === 'external') return true;
    return false;
  };

  if (!editing) {
    return (
      <Accordion title={title}>
        <div className='document-view-block-content'>
          <div className='avatars'>
            {approvers.map((approver) => (
              <Avatar
                key={`approver-${approver.id}`}
                {...approver}
                size='xsmall'
                showTooltip={isApproverRequired(approver)}
                currentlyWith={currentlyWith.includes(approver.id)}
                approverClass={isApproverRequired(approver) ? 'approver' : 'disabled'}
                approved={!!approver.approved_invoices.includes(id)}
                onHold={!!approver.on_hold_invoices.includes(id)}
              />
            ))}
            {buildingData?.can_view_building_rule && (
              <button
                type='button'
                className='view-building-rules-button'
                onClick={() => showModalType('building-rules')}
                style={{ fontSize: '90%' }}
              >
                View Rules
              </button>
            )}
          </div>
        </div>
      </Accordion>
    );
  }
  return null;
};
