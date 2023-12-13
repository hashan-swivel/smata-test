import React from 'react';
import { faBuilding, faCalendar, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inspectionDurationFormat, formatDateOnly, formatFullDateTime } from '../../../utils';

// Dumb component
const InspectionDropdownList = ({ item, handleItemOnclick }) => {
  const {
    current_building_inspection_time_log: currentTimeLog,
    last_building_inspection_time_log: lastTimeLog
  } = item;
  const timeLog = currentTimeLog || lastTimeLog;

  const statusIconIndicator = () => {
    switch (item?.state) {
      case 'ongoing':
        return <FontAwesomeIcon icon={faPlay} />;
      case 'paused':
        return <FontAwesomeIcon icon={faPause} />;
      case 'scheduled':
        return <FontAwesomeIcon icon={faCalendar} />;
      case 'stopped':
        return <FontAwesomeIcon icon={faStop} />;
      default:
        return null;
    }
  };

  return (
    <a
      href='#'
      className='building-inspection-dropdown-list-item'
      onClick={() => handleItemOnclick(item)}
    >
      <div className='building-inspection-session-footer'>
        {formatDateOnly(item.start_date)} - {formatDateOnly(item.end_date)}
      </div>
      <div className='building-inspection-session-header'>
        <div className='building-inspection-session-title'>
          <FontAwesomeIcon icon={faBuilding} />
          &nbsp;&nbsp;
          {item.location_name}
        </div>
      </div>
      <div className='building-inspection-session-body'>
        <strong>Duration of time permitted:</strong>
        &nbsp;
        <span>
          {item?.chargeable
            ? inspectionDurationFormat(item?.maximum_duration_in_seconds)
            : 'Unlimited'}
        </span>
        <br />
        <strong>Remaining duration:</strong>
        &nbsp;
        <span>
          {item?.chargeable ? inspectionDurationFormat(timeLog?.remaining_duration) : 'N/A'}
        </span>
        <br />
        <strong>Used duration:</strong>
        &nbsp;
        <span>{inspectionDurationFormat(item?.total_used_duration_in_seconds)}</span>
        <br />
        <strong>Last used at:</strong>
        &nbsp;
        <span>
          {timeLog?.last_started_at ? formatFullDateTime(timeLog?.last_started_at) : 'N/A'}
        </span>
        <br />
      </div>

      <div className='building-inspection-session-actions' style={{ textTransform: 'capitalize' }}>
        {statusIconIndicator()}
        &nbsp;
        {item.state}
      </div>
    </a>
  );
};

export default InspectionDropdownList;
