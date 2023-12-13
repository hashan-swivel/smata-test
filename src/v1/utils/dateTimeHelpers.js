import React from 'react';
import * as moment from 'moment';

export const scheduledDateLabel = (date) => {
  const daysUntil = moment().diff(moment.unix(date), 'days');

  if (daysUntil > 7) {
    return <span className='date overdue-date'>{moment.unix(date).format('Do MMM h:mm A')}</span>;
  }
  if (daysUntil >= 1 && daysUntil <= 7) {
    return (
      <span className='date overdue-date'>Last {moment.unix(date).format('dddd h:mm A')}</span>
    );
  }
  if (daysUntil === 0) {
    return <span className='date'>Today {moment.unix(date).format('h:mm A')}</span>;
  }
  if (daysUntil > -7 && daysUntil <= -1) {
    return <span className='date'>{moment.unix(date).format('dddd h:mm A')}</span>;
  }
  if (daysUntil <= -7 && daysUntil >= -14) {
    return <span className='date'>Next {moment.unix(date).format('dddd h:mm A')}</span>;
  }
  if (daysUntil <= -14) {
    return <span className='date'>{moment.unix(date).format('Do MMM h:mm A')}</span>;
  }
};

export const formatDateOnly = (ts) => moment.unix(ts).format('DD/MM/YYYY');

export const formatTimeOnly = (ts) => moment.unix(ts).format('H:mm a');

export const formatFullDateTime = (ts) => moment.unix(ts).format('DD/MM/YYYY H:mm:ss');

export const inspectionDurationFormat = (duration) => {
  if (duration === undefined || duration === null) return 'N/A';

  const m = Math.floor(duration / 60);
  const s = Math.floor(duration % 60);

  if (s !== 0 && m !== 0) return `${m}m:${s}s`;
  if (s === 0) return `${m}m`;

  return `${s}s`;
};

export const currentTimeInShortFormat = () => {
  const d = new Date();
  const hr = d.getHours();
  let min = d.getMinutes();

  if (min < 10) {
    min = `0${min}`;
  }

  return `${hr}:${min}`;
};
