import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAttachment } from '../../../actions/attachments';
import { setModalType } from '../../../actions/buildingProfile';
import { Link } from '../Link';
import { Avatar } from '../Avatar';
import './ContactDetailsModal.module.scss';

export const ContactDetailsModal = ({ spNumber, locations, enableBackButton }) => {
  const contact = useSelector((state) => state.buildingProfile.contactDetails);
  const isStrataManager = contact.role === 'strata_manager';
  const displayRoleText = (str) => (str ? str.replace(/_/g, ' ') : 'Contact');

  const dispatch = useDispatch();

  const onClickMessageHandler = () => {
    const attachedUser = [contact];
    dispatch(addAttachment({ spNumber, locations, users: attachedUser }));
  };

  return (
    <>
      <div className='contact-details-modal-container'>
        <div className='contact-details-avatar-wrapper'>
          <Avatar firstName={contact.first_name} lastName={contact.last_name} size='medium' />
        </div>

        <div className='contact-details-body-wrapper'>
          <div className='contact-details-heading'>
            <h4>
              <span>{`${contact.first_name} ${contact.last_name} `}</span>
              <span className='contact-details-role-text'>({displayRoleText(contact.role)})</span>
            </h4>
          </div>

          <div className='contact-details-display-fields'>
            <div>
              <span className='contact-details-subheading'>Ph: </span>
              <span>{contact.phone_number || 'N/A'}</span>
            </div>
            <div>
              <span className='contact-details-subheading'>Email: </span>
              <span>{contact.email}</span>
            </div>

            <div>
              {contact.is_user || isStrataManager ? (
                <Link
                  classNameProp='contact-details-message-button'
                  href='/src/pages/v1/messages'
                  query={{ createMessage: true }}
                  onClick={onClickMessageHandler}
                >
                  Send Message
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {enableBackButton ? (
        <div className='contact-details-back-button-container'>
          <button
            type='button'
            onClick={() => {
              dispatch(setModalType({ name: 'upcoming-work' }));
            }}
            className='button secondary'
          >
            Back
          </button>
        </div>
      ) : null}
    </>
  );
};
