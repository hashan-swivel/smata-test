import React from 'react';
import { useDispatch } from 'react-redux';
import { faCommentDots, faPencilAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '../../Avatar';
import { Link } from '../../Link';
import { userOptionObj, calcRatings } from '../../../../utils';
import { addAttachment } from '../../../../actions';
import { Tooltip } from 'react-tippy';

import './MainContacts.module.scss';
import '../../StarRating.module.scss';

export const BuildingTeamUsers = ({
  buildingProfile,
  currentUser,
  openModal,
  setUserForRating,
  setTypeToBeRated,
  buildingTeamUsers
}) => {
  const dispatch = useDispatch();

  const locations = buildingProfile?.locations;
  const spNumber = buildingProfile?.site_plan_id;

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

  const renderBuildingTeamUser = (buildingTeamUser) => {
    const user = userOptionObj(buildingTeamUser.user);
    const rating = buildingTeamUser?.rating ? calcRatings(buildingTeamUser.rating) : 0;

    return (
      <div className='building-team-user' key={buildingTeamUser?.id}>
        <Avatar {...user} size='small-to-medium' />
        <div className='main-contact'>
          <strong>{buildingTeamUser.role}</strong>
          <span>
            {user.first_name} {user.last_name}
          </span>
          {buildingProfile?.can_view_star_rating && (
            <div className='star-rating' style={{ display: 'flex' }}>
              <span
                className='Stars'
                style={{ '--rating': parseFloat(rating), marginRight: '5px', marginLeft: '-3px' }}
                aria-label={`${rating} out of 5.`}
              />
              <a
                href='#'
                role='button'
                onClick={(e) => {
                  setTypeToBeRated(user.role);
                  setUserForRating(user);
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
                onClick={() => handleSendMessage(user)}
                title='Send Message'
              >
                <FontAwesomeIcon
                  icon={faCommentDots}
                  color='#4FCBB2'
                  style={{ marginRight: '10px' }}
                />
              </Link>
            )}
            {user.phone_number ? (
              <Tooltip
                arrow
                title={user.phone_number}
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
    );
  };

  return (
    <>
      <div className='building-main-contacts'>
        {buildingTeamUsers &&
          buildingTeamUsers.length > 0 &&
          buildingTeamUsers.map((buildingTeamUser) => renderBuildingTeamUser(buildingTeamUser))}
      </div>
    </>
  );
};
