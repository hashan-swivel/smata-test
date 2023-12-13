import React, { useState } from 'react';
import MeetingCarousel from '../Meetings/MeetingCarousel';

import './MeetingSection.module.scss';

export const MeetingSection = ({ account_id }) => {
  const [meetingState, setMeetingState] = useState('upcoming');

  return (
    <section className='meeting-section'>
      <div className='meetings-state-switches'>
        <button
          type='button'
          className={`meeting-state__upcoming ${meetingState === 'upcoming' ? 'active' : ''}`}
          onClick={() => setMeetingState('upcoming')}
        >
          Upcoming Meetings
        </button>
        <button
          type='button'
          className={`meeting-state__completed ${meetingState === 'completed' ? 'active' : ''}`}
          onClick={() => setMeetingState('completed')}
        >
          Completed Meetings
        </button>
      </div>
      <MeetingCarousel meetingState={meetingState} account_id={account_id} />
    </section>
  );
};
