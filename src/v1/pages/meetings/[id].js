import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faDoorClosed,
  faMapMarkerAlt,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { Layout, Loading } from '@/components/v1';
import { meetingConstants } from '@/constants';
import { meetingAttachmentActions, meetingActions, modalActions } from '@/actions';
import MeetingAgendaSection from '@/components/v1/Meetings/MeetingAgendaSection';
import MeetingAttachmentSection from '@/components/v1/Meetings/MeetingAttachmentSection';

import Error from '../_error';

import './[id].module.scss';

const Show = (meeting) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { currentMeeting, currentMeetingLoading, error } = meeting;
  const currentUser = useSelector((state) => state.auth.currentUser);

  const fetchMeetingAttachment = () => {
    dispatch(
      meetingAttachmentActions.getMeetingAttachments({
        meeting_register_id: currentMeeting?.id
      })
    );
  };

  useEffect(() => {
    dispatch(meetingActions.getMeeting(id));
  }, []);

  if (error) {
    return <Error statusCode={error?.response?.status} />;
  }

  if (currentMeetingLoading) {
    return <Loading />;
  }

  return (
    <div className='meetings__page'>
      <h3 className='page__header' style={{ marginTop: '2rem' }}>
        {currentMeeting.meeting_type}
      </h3>
      <p className='page__header--secondary'>
        {currentMeeting.can_vote && (
          <>
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#4FCBB2' }} />
            &nbsp;Pre-voting is available for this meeting
          </>
        )}
      </p>
      <div className='meetings__wrapper'>
        <div className='meetings__container--left'>
          <MeetingAgendaSection meeting={currentMeeting} />
        </div>

        <div className='meetings__container--right'>
          <section className='meeting-details'>
            <h4 style={{ paddingBottom: '.5rem' }}>Meeting details</h4>
            <h6 className='meeting-detail'>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{ paddingRight: '.17rem', paddingLeft: '.17rem' }}
              />
              <span title={currentMeeting.meeting_venue || 'TBD'}>
                {currentMeeting.meeting_venue || 'TBD'}
              </span>
            </h6>
            <h6 className='meeting-detail'>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ paddingLeft: '.15rem' }} />
              <span>
                {currentMeeting.meeting_date && currentUser?.formatted_timezone_offset
                  ? moment
                      .unix(currentMeeting.meeting_date)
                      ?.utcOffset(currentUser?.formatted_timezone_offset)
                      ?.format('D MMM YYYY')
                  : 'TBD'}
              </span>
            </h6>
            <h6 className='meeting-detail'>
              <FontAwesomeIcon icon={faClock} />
              <span>
                {currentMeeting.meeting_date && currentUser?.formatted_timezone_offset
                  ? moment
                      .unix(currentMeeting.meeting_date)
                      ?.utcOffset(currentUser?.formatted_timezone_offset)
                      ?.format('hh:mm A')
                  : 'TBD'}
              </span>
            </h6>
          </section>
          <section className='building-details'>
            <h4 style={{ paddingBottom: '.5rem' }}>Building details</h4>
            <div className='building-detail'>
              <a
                href={`/building-profile?id=${encodeURIComponent(
                  currentMeeting?.building?.sp_number
                )}`}
              >
                <FontAwesomeIcon
                  icon={faBuilding}
                  style={{ paddingRight: '.15rem', paddingLeft: '.15rem' }}
                />
                <span style={{ color: '#4A90E2' }}>{currentMeeting?.building?.name}</span>
              </a>
            </div>
            <div className='building-detail'>
              <FontAwesomeIcon icon={faDoorClosed} />
              <span>Lot: </span>
              {currentMeeting.lot_numbers.map((l) => l.name).join(', ')}
              {currentMeeting.lot_numbers.length === 0 && 'N/A'}
            </div>
          </section>
          <section style={{ paddingTop: '1rem' }}>
            <h4 style={{ paddingBottom: '.5rem' }}>
              Attachments
              {currentUser?.isTenantManager && (
                <button
                  type='button'
                  className='button button--link'
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                  onClick={() =>
                    dispatch(
                      modalActions.showModal('MEETING_ATTACHMENT_UPLOAD', {
                        meeting_register_id: currentMeeting?.id,
                        handleAfterClose: fetchMeetingAttachment
                      })
                    )
                  }
                >
                  <FontAwesomeIcon icon={faUpload} />
                </button>
              )}
            </h4>
            <MeetingAttachmentSection meeting={currentMeeting} />
          </section>
        </div>
      </div>
    </div>
  );
};

Show.getLayout = (page) => (
  <Layout customSeo={meetingConstants.SHOW_SEO} headerClassName='mw-100'>
    {page}
  </Layout>
);

export default connect((state) => state.meetings)(Show);
