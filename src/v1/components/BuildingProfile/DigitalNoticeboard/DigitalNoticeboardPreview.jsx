import * as moment from 'moment';
import { currentTimeInShortFormat, getOrdinal } from '../../../../utils';
import { datetimeConstants } from '../../../../constants';

import './DigitalNoticeboard.module.scss';

const PreviewHeader = ({ digitalNoticeboard }) => {
  let buildingMessageImg = '/building-message-news-2.png';
  if (
    digitalNoticeboard?.remote_name === 'news.html' ||
    digitalNoticeboard?.remote_name === 'welcome.html'
  ) {
    buildingMessageImg = '/building-message-news.png';
  }
  if (digitalNoticeboard?.remote_name === 'events.html') {
    buildingMessageImg = '/building-event-guild.png';
  }

  return (
    <div className='digital-noticeboard-preview__header'>
      <div className='digital-noticeboard-preview__header--left'>
        <img src={buildingMessageImg} alt='Building Message' />
      </div>
      <div className='digital-noticeboard-preview__header--right'>
        <img
          className='digital-noticeboard-preview__logo'
          src={digitalNoticeboard?.logo}
          alt='Logo'
        />
      </div>
    </div>
  );
};

const PreviewFooter = () => (
  <div className='digital-noticeboard-preview__footer'>
    <div className='digital-noticeboard-preview__footer digital-noticeboard-preview__footer--left'>
      <span className='digital-noticeboard-preview__footer digital-noticeboard-preview__clock'>
        {currentTimeInShortFormat()}
      </span>
    </div>
  </div>
);

const Alert = ({ digitalNoticeboard }) => (
  <div className='digital-noticeboard-preview-container'>
    <div className='digital-noticeboard-preview'>
      <PreviewHeader digitalNoticeboard={digitalNoticeboard} />
      <div className='digital-noticeboard-preview__content'>
        <div className='digital-noticeboard-preview__alert-image'>
          <img src='/digital-noticeboard-alert-image.png' alt='Alert' />
        </div>
        <div className='digital-noticeboard-preview__message-box--alert digital-noticeboard-preview__message-box--primary'>
          <div className='digital-noticeboard-preview__heading-text'>
            {digitalNoticeboard?.heading}
          </div>
          <div className='digital-noticeboard-preview__main-copy-text'>
            {digitalNoticeboard?.main_copy}
          </div>
        </div>
      </div>
      <PreviewFooter />
    </div>
  </div>
);

const Message = ({ digitalNoticeboard }) => (
  <div className='digital-noticeboard-preview-container'>
    <div className='digital-noticeboard-preview'>
      <PreviewHeader digitalNoticeboard={digitalNoticeboard} />
      <div className='digital-noticeboard-preview__content'>
        <div className='digital-noticeboard-preview__message-box--message digital-noticeboard-preview__message-box--primary'>
          <div className='digital-noticeboard-preview__heading-text'>
            {digitalNoticeboard?.heading}
          </div>
          <div className='digital-noticeboard-preview__main-copy-text'>
            {digitalNoticeboard?.main_copy}
          </div>
        </div>
      </div>
      <PreviewFooter />
    </div>
  </div>
);

const News = ({ digitalNoticeboard }) => (
  <div className='digital-noticeboard-preview-container'>
    <div className='digital-noticeboard-preview'>
      <PreviewHeader digitalNoticeboard={digitalNoticeboard} />
      <div className='digital-noticeboard-preview__content'>
        <div className='digital-noticeboard-preview__news-image-placeholder'>
          {digitalNoticeboard?.image !== null && digitalNoticeboard?.image !== undefined && (
            <img
              className='digital-noticeboard-preview__news-image'
              src={digitalNoticeboard.image}
              alt='Preview'
            />
          )}
        </div>
        <div className='digital-noticeboard-preview__message-box--news digital-noticeboard-preview__message-box--primary'>
          <div className='digital-noticeboard-preview__heading-text'>
            {digitalNoticeboard?.heading}
          </div>
          <div className='digital-noticeboard-preview__main-copy-text'>
            {digitalNoticeboard?.main_copy}
          </div>
        </div>
      </div>
      <PreviewFooter />
    </div>
  </div>
);

const Welcome = ({ digitalNoticeboard }) => (
  <div className='digital-noticeboard-preview-container'>
    <div className='digital-noticeboard-preview'>
      <PreviewHeader digitalNoticeboard={digitalNoticeboard} />
      <div className='digital-noticeboard-preview__content'>
        <div className='digital-noticeboard-preview__message-box--welcome digital-noticeboard-preview__message-box--primary'>
          <div className='digital-noticeboard-preview__heading-text'>
            {digitalNoticeboard?.heading}
          </div>
          <div className='digital-noticeboard-preview__main-copy-text'>
            {digitalNoticeboard?.main_copy}
          </div>
        </div>
        <div className='digital-noticeboard-preview__extra-copy-and-qr'>
          <div className='digital-noticeboard-preview__extra-copy-text'>
            {digitalNoticeboard?.extra_copy}
          </div>
          <div className='digital-noticeboard-preview__qr-image-placeholder'>
            {digitalNoticeboard?.qr !== null && digitalNoticeboard?.qr !== undefined && (
              <img
                className='digital-noticeboard-preview__qr-image'
                src={digitalNoticeboard?.qr}
                alt='Preview'
              />
            )}
          </div>
        </div>
      </div>
      <PreviewFooter />
    </div>
  </div>
);

const Event = ({ digitalNoticeboard }) => {
  const initializePreviewImage = '/digital-noticeboard-narrow-image-placeholder.png';
  const date1 = digitalNoticeboard?.event1_date;
  const formattedDate1 = moment(date1, datetimeConstants.FORMAT.DEFAULT).format('MMM D YY');
  const month1 = formattedDate1.split(' ')[0];
  const day1 = formattedDate1.split(' ')[1];
  const weekDay1 = new Date(
    moment(date1, datetimeConstants.FORMAT.DEFAULT).format('MM/DD/YYYY')
  ).toLocaleString('en-us', { weekday: 'long' });

  let image1 = initializePreviewImage;
  if (digitalNoticeboard?.event1_image) {
    image1 = digitalNoticeboard?.event1_image;
  }
  return (
    <div className='digital-noticeboard-preview-container'>
      <div className='digital-noticeboard-preview'>
        <PreviewHeader digitalNoticeboard={digitalNoticeboard} />
        <div className='digital-noticeboard-preview__content'>
          <div className='digital-noticeboard-preview__event-box'>
            <div className='digital-noticeboard-preview__event-date'>
              <div className='digital-noticeboard-preview__event-month'>{month1}</div>
              <div className='digital-noticeboard-preview__event-day-of-month'>
                {day1}
                <sup>{getOrdinal(day1)}</sup>
              </div>
            </div>
            <div className='digital-noticeboard-preview__event-information-container'>
              <div className='digital-noticeboard-preview__event-information'>
                <div className='digital-noticeboard-preview__event-time'>
                  {digitalNoticeboard?.event1_time}
                </div>
                <div className='digital-noticeboard-preview__event-week-day'>{weekDay1}</div>
                <span className='digital-noticeboard-preview__event-heading'>
                  {digitalNoticeboard?.event1_heading}
                </span>
                <div className='digital-noticeboard-preview__event-description'>
                  {digitalNoticeboard?.event1_description}
                </div>
                <div className='digital-noticeboard-preview__event-location'>
                  <div className='marker' />
                  <div className='digital-noticeboard-preview__event-location-text'>
                    {digitalNoticeboard?.event1_location}
                  </div>
                </div>
              </div>
            </div>
            <div className='digital-noticeboard-preview__event-image'>
              <img src={image1} alt='Preview' />
            </div>
          </div>
        </div>
        <PreviewFooter />
      </div>
    </div>
  );
};

const PREVIEW_COMPONENTS = {
  'alert.html': Alert,
  'message.html': Message,
  'news.html': News,
  'welcome.html': Welcome,
  'events.html': Event
};

export const DigitalNoticeboardPreview = ({ digitalNoticeboard }) => {
  const SpecificPreview = PREVIEW_COMPONENTS[digitalNoticeboard?.remote_name];

  if (SpecificPreview) {
    return <SpecificPreview digitalNoticeboard={digitalNoticeboard} />;
  }

  return null;
};
