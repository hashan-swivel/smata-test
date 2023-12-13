import React from 'react';
import { Avatar } from '../../Avatar';
import { userOptionObj } from '../../../../utils';
import Accordion from '../InvoiceView/Accordion';

export const Visibility = ({ data }) => {
  const users = data.additional_users.map(userOptionObj);

  const mapAvatars = () => {
    // If less than 4 contacts, just render the avatar for those
    if (users && users.length <= 8) {
      return users.map((contact) => (
        <Avatar key={contact.id} {...contact} size='xsmall' showTooltip />
      ));
    }
    // If more than 4 contacts, calculate how many more than 4 and render that amount as the 5th avatar
    if (users && users.length > 8) {
      const newUsersArray = users.slice(0, 8);
      const remainderCount = users.length - 8;
      const otherUsers = users.slice(-remainderCount);

      return (
        <span className='avatars'>
          {newUsersArray.map((contact) => (
            <Avatar key={contact.id} {...contact} size='xsmall' showTooltip />
          ))}
          <Avatar
            remainder={remainderCount}
            tooltipText={otherUsers.map((otherUser) => otherUser.label)}
            size='xsmall'
            primaryBg
            showTooltip
          />
        </span>
      );
    }
    return null;
  };

  return (
    <Accordion title='Visibility'>
      <div className='document-view-block-content'>
        {users.length > 0 && (
          <section className='individual-shared-with' style={{ marginBottom: '1rem' }}>
            <h6>Shared With Individual:</h6>
            {mapAvatars()}
          </section>
        )}
        {data.organisation_category_settings && data.organisation_category_settings.length > 0 && (
          <section className='organisation-document-category' style={{ marginBottom: '1rem' }}>
            <h6>Shared With Role by Organisation Setting:</h6>
            {data.organisation_category_settings.map((u) => (
              <span className='badge badge--secondary' style={{ marginRight: '.5rem' }}>
                {u.label}
              </span>
            ))}
          </section>
        )}
        {data.building_document_permissions && data.building_document_permissions.length > 0 && (
          <section className='building-document-category' style={{ marginBottom: '1rem' }}>
            <h6>Shared With Role by Building Setting:</h6>
            {data.building_document_permissions.map((u) => (
              <span className='badge badge--secondary' style={{ marginRight: '.5rem' }}>
                {u.label}
              </span>
            ))}
          </section>
        )}
      </div>
    </Accordion>
  );
};
