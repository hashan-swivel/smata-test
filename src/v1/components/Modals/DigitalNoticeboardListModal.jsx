import React, { useState } from 'react';
import { connect } from 'react-redux';
import './DigitalNoticeboardListModal.module.scss';
import Select from 'react-select';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {
  digitalNoticeboardActions,
  digitalNoticeboardScreenActions,
  modalActions
} from '../../../actions';
import { datetimeConstants, digitalNoticeboardConstants } from '../../../constants';
import { NotFound } from '../DMS';
import { DigitalNoticeboardPreview } from '../BuildingProfile/DigitalNoticeboard';
import ModalContainer from './ModalContainer';
import { warningSwal } from '../../../utils';

const DigitalNoticeboardListItem = ({ noticeboard, dispatch, buildingProfile }) => {
  const handleEditButtonClicked = () => {
    dispatch(
      modalActions.showModal('CREATE_EDIT_DIGITAL_NOTICEBOARD', { noticeboard, buildingProfile })
    );
  };

  const handleDeleteButtonClicked = () => {
    withReactContent(Swal)
      .fire(warningSwal({ confirmButtonText: 'DELETE' }))
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(digitalNoticeboardActions.deleteDigitalNoticeboard(noticeboard.id));
        }
      });
  };

  return (
    <div key={noticeboard.id} className='digital-noticeboard-item'>
      <DigitalNoticeboardPreview digitalNoticeboard={noticeboard} />
      <div className='digital-noticeboard-item--info'>
        <div className='digital-noticeboard-item__screen-name-and-buttons'>
          <div className='digital-noticeboard-item__screen-name'>
            <h5 style={{ color: '#4A90E2' }}>{noticeboard?.digital_noticeboard_screen?.name}</h5>
          </div>
          <div className='action-buttons'>
            <button
              type='button'
              className='button button--link'
              style={{ padding: '0 0.2rem 0 0' }}
              onClick={() => handleEditButtonClicked(noticeboard)}
            >
              <FontAwesomeIcon icon={faPencilAlt} size='sm' />
            </button>
            <button
              type='button'
              className='button button--link'
              style={{ padding: '0 0 0 0.2rem' }}
              onClick={() => handleDeleteButtonClicked(noticeboard)}
            >
              <FontAwesomeIcon icon={faTrashAlt} size='sm' />
            </button>
          </div>
        </div>
        <div className='digital-noticeboard-item__time-frame'>
          {[
            moment.unix(noticeboard.start_at).format(datetimeConstants.FORMAT.DEFAULT),
            moment.unix(noticeboard.end_at).format(datetimeConstants.FORMAT.DEFAULT)
          ].join(' - ')}
        </div>
        <span
          className={`digital-noticeboard-item__status digital-noticeboard-item--${noticeboard.state}`}
        >
          {noticeboard.state}
        </span>
      </div>
    </div>
  );
};

const DigitalNoticeboardListModal = ({ list, dispatch, buildingProfile }) => {
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [byState, setByState] = useState(null);

  const filterItems = () => {
    let items = list.filter((item) =>
      byState?.value?.length > 0 ? item.state === byState.value : item.state
    );

    if (byState?.value?.length > 0) {
      items = items.filter((item) => item.state === byState.value);
    }

    if (selectedScreen?.value) {
      items = items.filter(
        (item) => item.digital_noticeboard_screen?.value === selectedScreen.value
      );
    }

    if (items.length === 0) {
      return <NotFound text='No Noticeboards Found' />;
    }

    return items.map((item) => (
      <DigitalNoticeboardListItem
        noticeboard={item}
        key={item.id}
        dispatch={dispatch}
        buildingProfile={buildingProfile}
      />
    ));
  };

  return (
    <ModalContainer
      title='Digital Noticeboards'
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <form>
        <div className='c-modal__body digital-noticeboard-list'>
          <fieldset>
            <div className='form__group' style={{ display: 'flex' }}>
              <div className='form__group' style={{ flex: '50%', paddingRight: '5px' }}>
                <div className='form__control'>
                  <label htmlFor='screen'>Screen</label>
                </div>
                <div className='form__control'>
                  <AsyncSelect
                    isClearable
                    cacheOptions
                    value={selectedScreen}
                    loadOptions={debounce(
                      (inputValue, callback) =>
                        digitalNoticeboardScreenActions.loadDigitalNoticeboardScreenOptions(
                          buildingProfile,
                          inputValue,
                          callback
                        ),
                      500
                    )}
                    defaultOptions
                    onChange={(o) => setSelectedScreen(o)}
                    blurInputOnSelect
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
              </div>
              <div className='form__control' style={{ flex: '50%', paddingLeft: '5px' }}>
                <label htmlFor='byState'>Status</label>
                <Select
                  isClearable
                  name='byState'
                  options={digitalNoticeboardConstants.ALL_STATE_OPTIONS}
                  blurInputOnSelect
                  value={byState}
                  defaultValue=''
                  onChange={(o) => setByState(o)}
                  classNamePrefix='react-select'
                />
              </div>
            </div>
          </fieldset>
          {filterItems()}
        </div>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.digitalNoticeboards)(DigitalNoticeboardListModal);
