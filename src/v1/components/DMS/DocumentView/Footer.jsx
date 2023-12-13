import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '../../index';
import { axiosInstance } from '../../../../utils';
import { flashActions, addAttachment } from '../../../../actions';

import './Footer.module.scss';

export const Footer = ({
  editing,
  toggleEditMode,
  invoice,
  id,
  buildingData,
  spNumber,
  filename,
  category,
  editFailed,
  hasJob,
  messageServiceProviderLink,
  users
}) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!spNumber) return;

    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(spNumber)}`)
      .then((res) => {
        const attachment = {
          id,
          spNumber,
          locations: res.data.locations,
          category,
          users,
          filename,
          can_message: res.data.can_message
        };

        window.localStorage.setItem('message_attachment', JSON.stringify(attachment));
        dispatch(addAttachment(attachment));
        window.open(`${window.location.origin}/messages?createMessage=true`, '_blank');
      })
      .catch((error) => flashActions.showError(error));
  };

  useEffect(() => {
    setSubmitting(false);
  }, [editing]);

  useEffect(() => {
    if (editFailed) setSubmitting(false);
  }, [editFailed]);

  if (!editing)
    return (
      <div className='document-footer'>
        <div className='document-footer__left'>
          {buildingData && buildingData?.can_message && (
            <button type='button' className='button secondary' onClick={handleSendMessage}>
              Message Stakeholders
            </button>
          )}

          {hasJob && messageServiceProviderLink && buildingData?.can_message && (
            <Link href={messageServiceProviderLink} classNameProp='button button--secondary'>
              Message Service Provider
            </Link>
          )}
        </div>

        <div className='document-footer__right'>
          {spNumber && (
            <Link
              href='/v1/documents'
              query={invoice ? { showInvoice: true, sp_number: spNumber } : { sp_number: spNumber }}
              classNameProp='button button--primary'
            >
              Search by {spNumber}
            </Link>
          )}

          <Link
            href='/v1/documents'
            query={{ showInvoice: !!invoice }}
            classNameProp='button button--primary'
          >
            Back to index
          </Link>
        </div>
      </div>
    );

  return (
    <div className='document-footer'>
      <div className='document-footer__left' />
      <div className='document-footer__right'>
        {!submitting && (
          <button type='button' className='button button--secondary' onClick={toggleEditMode}>
            Cancel
          </button>
        )}
        <button
          type='button'
          className='button button--primary'
          onClick={(event) => {
            setSubmitting(true);
            toggleEditMode(event, true);
          }}
          disabled={submitting}
        >
          {editFailed || !submitting ? 'Save Changes' : 'Updating...'}
        </button>
      </div>
    </div>
  );
};
