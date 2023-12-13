import React from 'react';
import NoMessages from '../../../images/illustrations/no-messages.svg';
import { Avatar } from '../Avatar';
import './MessageStart.module.scss';

export const MessageStart = (props) => {
  const { currentUsers } = props;
  if (currentUsers) {
    return (
      <div className='message-start-container'>
        <img className='start-conversation' src={NoMessages} alt='Start the conversation' />
        <h4 className='start-conversation-title'>Start the conversation below</h4>
        <div className='start-conversation-avatars'>
          {currentUsers.map((user) => (
            <Avatar
              key={user.id}
              firstName={user.first_name}
              lastName={user.last_name}
              size='xsmall'
              showTooltip
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
};
