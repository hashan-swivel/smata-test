import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { buildingInspectionSessionActions } from '../../../actions';

const InspectionSessionTimer = ({ currentSession, dispatch }) => {
  const {
    current_building_inspection_time_log: currentTimeLog,
    chargeable: countDown,
    state
  } = currentSession;
  const { remaining_duration: remainingDuration, calculated_used_duration: usedDuration } =
    currentTimeLog || {};
  const duration = countDown ? remainingDuration : usedDuration;

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // exit early when we reach 0 or timer is not ongoing
    if (!timeLeft || state !== 'ongoing') return;

    // save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      if (countDown) {
        const newTimeLeft = timeLeft - 1;

        setTimeLeft(newTimeLeft);
        if (newTimeLeft === 0) onTimeout();
      } else {
        setTimeLeft(timeLeft + 1);
      }
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const onTimeout = () => {
    dispatch(buildingInspectionSessionActions.stopInspection(currentSession));
  };

  const secondsToTime = () => {
    if (timeLeft === null || timeLeft === undefined) return '00:00:00';

    const h = Math.floor(timeLeft / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((timeLeft % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(timeLeft % 60)
      .toString()
      .padStart(2, '0');

    return `${h}:${m}:${s}`;
  };

  return (
    <div className='current-building-inspection-session'>
      <span className='icon icon-clock-white' />
      &nbsp;&nbsp;
      <h4 className={`building-inspection-session-timer ${timeLeft === 0 ? 'text--danger' : ''}`}>
        {secondsToTime()}
      </h4>
    </div>
  );
};

export default connect((state) => state.buildingInspectionSessions)(InspectionSessionTimer);
