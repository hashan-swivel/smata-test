import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import * as moment from 'moment';
import AliceCarousel from 'react-alice-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faCheckCircle,
  faClock,
  faMapMarkerAlt,
  faVoteYea
} from '@fortawesome/free-solid-svg-icons';
import { meetingActions } from '../../../actions';
import { meetingConstants } from '../../../constants';
import { Loading } from '../Loading';
import { NotFound } from '../DMS';

//import './MeetingCarousel.module.scss';

const MeetingCarouselItem = ({ meeting, currentUser }) => {
  const offsetMeetingDate =
    meeting.meeting_date && currentUser?.formatted_timezone_offset
      ? moment.unix(meeting.meeting_date).utcOffset(currentUser?.formatted_timezone_offset)
      : null;
  const date = offsetMeetingDate?.format('D MMM YY');
  const time = offsetMeetingDate?.format('hh:mm A');
  let meetingState = 'non-votable';
  if (meeting.state === 'upcoming' && meeting.can_vote)
    meetingState = meeting.voted ? 'voted' : 'unvoted';

  const actionButton = () => {
    let buttonChild = 'MORE DETAILS';

    if (meetingState === 'voted') {
      buttonChild = (
        <>
          <FontAwesomeIcon icon={faCheckCircle} />
          &nbsp;VOTED
        </>
      );
    }

    if (meetingState === 'unvoted') {
      buttonChild = (
        <>
          <FontAwesomeIcon icon={faVoteYea} />
          &nbsp;VOTE
        </>
      );
    }

    return (
      <a
        role='button'
        href={meetingConstants.BASE_PATH.replace('meeting-id', meeting.id)}
        className='button vote-button'
      >
        {buttonChild}
      </a>
    );
  };

  return (
    <div
      className={`meeting-carousel-item meeting-carousel-item--${meetingState}`}
      key={meeting.id}
    >
      <div className='meeting-carousel-item__header'>
        <h4>{meeting.meeting_type}</h4>
      </div>
      <div className='meeting-carousel-item__body'>
        <div className='meeting-carousel-item__body--left'>
          <h5 className='meeting-carousel-item--day'>
            <FontAwesomeIcon icon={faCalendar} />
            <span title={date || 'TBD'}>{date || 'TBD'}</span>
          </h5>
        </div>

        <div className='meeting-carousel-item__body--right'>
          <h5 className='meeting-carousel-item--time'>
            <FontAwesomeIcon icon={faClock} />
            <span title={time || 'TBD'}>{time || 'TBD'}</span>
          </h5>
        </div>
      </div>
      <div className='meeting-carousel-item__footer'>
        <h6 className='meeting-carousel-item--location'>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ paddingRight: '.15rem', paddingLeft: '.15rem' }}
          />
          <span title={meeting.meeting_venue || 'TBD'}>{meeting.meeting_venue || 'TBD'}</span>
        </h6>
        {actionButton()}
      </div>
    </div>
  );
};

const MeetingCarousel = ({ meetingState, list, listLoading, dispatch, account_id }) => {
  const responsive = {
    0: { items: 1 },
    660: { items: 2 },
    1024: { items: 4 }
  };
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    // API requirement from the best BE developer in the world!!!
    const params = {};
    if (meetingState === 'upcoming') {
      params.upcoming = 'true';
    }
    if (meetingState === 'completed') {
      params.completed = 'true';
    }
    dispatch(meetingActions.getMeetings(account_id, params));
  }, [meetingState]);

  if (listLoading) {
    return <Loading componentLoad />;
  }

  if (list.length === 0) {
    return <NotFound text='No Meeting Found' />;
  }

  return (
    <div className='meeting-carousel-items'>
      <AliceCarousel
        mouseTrackingEnabled
        touchTrackingEnabled
        preventEventOnTouchMove
        responsive={responsive}
        dotsDisabled
        autoPlay
        autoPlayInterval={7000}
        items={list.map((meeting) => (
          <MeetingCarouselItem meeting={meeting} currentUser={currentUser} />
        ))}
      />
    </div>
  );
};

export default connect((state) => state.meetings)(MeetingCarousel);
