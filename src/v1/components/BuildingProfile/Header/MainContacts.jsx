import React from 'react';
import { useDispatch } from 'react-redux';
import { faCommentDots, faPencilAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '../../Avatar';
import { Link } from '../../Link';
import { calcRatings } from '../../../../utils';
import { addAttachment } from '../../../../actions';
import { Tooltip } from 'react-tippy';

import './MainContacts.module.scss';
import '../../StarRating.module.scss';

export const MainContacts = ({
  currentUser,
  strataManager,
  buildingManager,
  openModal,
  setUserForRating,
  setTypeToBeRated,
  spNumber,
  locations,
  buildingProfile
}) => {
  const dispatch = useDispatch();

  const smRating = strataManager?.rating ? calcRatings(strataManager.rating) : 0;
  const bmRating = buildingManager?.rating ? calcRatings(buildingManager.rating) : 0;

  const handleSendMessage = (userContact) => {
    const attachedUser = currentUser.id === userContact.id ? [] : [userContact];
    const attachment = {
      spNumber,
      locations,
      users: attachedUser,
      can_message: buildingProfile?.can_message
    };

    window.localStorage.setItem('message_attachment', JSON.stringify(attachment));
    dispatch(addAttachment(attachment));
  };

  return (
    <>
      <div className='building-main-contacts'>
        {strataManager.id && (
          <div className='strata-manager'>
            <Avatar {...strataManager} size='small-to-medium' showTooltip />
            <div className='main-contact'>
              <strong>Strata Manager</strong>
              <span>{strataManager.label}</span>
              {buildingProfile?.can_view_star_rating && (
                <div className='star-rating' style={{ display: 'flex' }}>
                  <span
                    className='Stars'
                    style={{
                      '--rating': parseFloat(smRating),
                      marginRight: '5px',
                      marginLeft: '-3px'
                    }}
                    aria-label={`${smRating} out of 5.`}
                  />
                  <a
                    href='#'
                    role='button'
                    onClick={(e) => {
                      setTypeToBeRated('strata_manager');
                      setUserForRating(strataManager);
                      openModal(e, 'rating');
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} size='sm' color='#4FCBB2' />
                  </a>
                </div>
              )}
              <div className='contact-methods' style={{ display: 'flex', padding: '3px 0' }}>
                {buildingProfile?.can_message && (
                  <Link
                    classNameProp='send-message-link'
                    href='/src/pages/v1/messages'
                    query={{ createMessage: true }}
                    onClick={() => handleSendMessage(strataManager)}
                    title='Send Message'
                  >
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      color='#4FCBB2'
                      style={{ marginRight: '10px' }}
                    />
                  </Link>
                )}
                {strataManager.phone_number ? (
                  <Tooltip
                    arrow
                    title={strataManager.phone_number}
                    position='bottom'
                    animation='fade'
                    theme='light'
                  >
                    <FontAwesomeIcon icon={faPhone} color='#4FCBB2' size='sm' />
                  </Tooltip>
                ) : (
                  <a role='button' title='Not Available'>
                    <FontAwesomeIcon icon={faPhone} color='#797979' size='sm' />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        {buildingManager.id && (
          <div className='building-manager'>
            <Avatar {...buildingManager} size='small-to-medium' showTooltip />
            <div className='main-contact'>
              <strong>Building Manager</strong>
              <span>{buildingManager.label}</span>
              {buildingProfile?.can_view_star_rating && (
                <div className='star-rating' style={{ display: 'flex' }}>
                  <span
                    className='Stars'
                    style={{
                      '--rating': parseFloat(bmRating),
                      marginRight: '5px',
                      marginLeft: '-3px'
                    }}
                    aria-label={`${bmRating} out of 5.`}
                  />
                  <a
                    href='#'
                    role='button'
                    onClick={(e) => {
                      setTypeToBeRated('building_manager');
                      setUserForRating(buildingManager);
                      openModal(e, 'rating');
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} size='sm' color='#4FCBB2' />
                  </a>
                </div>
              )}
              <div className='contact-methods' style={{ display: 'flex', padding: '3px 0' }}>
                {buildingProfile?.can_message && (
                  <Link
                    classNameProp='send-message-link '
                    href='/src/pages/v1/messages'
                    query={{ createMessage: true }}
                    onClick={() => handleSendMessage(buildingManager)}
                    title='Send Message'
                  >
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      color='#4FCBB2'
                      style={{ marginRight: '10px' }}
                    />
                  </Link>
                )}
                {buildingManager.phone_number ? (
                  <Tooltip
                    arrow
                    title={buildingManager.phone_number}
                    position='bottom'
                    animation='fade'
                    theme='light'
                  >
                    <FontAwesomeIcon icon={faPhone} color='#4FCBB2' size='sm' />
                  </Tooltip>
                ) : (
                  <a role='button' title='Not Available'>
                    <FontAwesomeIcon icon={faPhone} color='#797979' size='sm' />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
