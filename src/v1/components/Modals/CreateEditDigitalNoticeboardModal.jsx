import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { debounce } from 'lodash';
import { connect, useSelector } from 'react-redux';
import { Loading } from '../Loading';
import {
  digitalNoticeboardActions,
  digitalNoticeboardScreenActions,
  digitalNoticeboardTemplateActions,
  modalActions
} from '../../../actions';
import {
  AlertForm,
  MessageForm,
  WelcomeForm,
  NewsForm,
  DigitalNoticeboardPreview
} from '../BuildingProfile/DigitalNoticeboard';
import ModalContainer from './ModalContainer';

const TEMPLATE_COMPONENTS = {
  'alert.html': AlertForm,
  'message.html': MessageForm,
  'news.html': NewsForm,
  'welcome.html': WelcomeForm
  // 'events.html': EventsForm,
};

const CreateEditDigitalNoticeboardModal = ({
  dispatch,
  list,
  listLoading,
  noticeboard,
  buildingProfile
}) => {
  const editing = !!noticeboard?.id;
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(
    noticeboard?.digital_noticeboard_screen || null
  );
  const [noticeboardFormData, setNoticeboardFormData] = useState(noticeboard);

  useEffect(() => {
    if (!editing) dispatch(digitalNoticeboardTemplateActions.getDigitalNoticeboardTemplates());
  }, []);

  useEffect(() => {
    setSelectedTemplate(list[0]);
  }, [list]);

  const onAfterSubmit = () => {
    dispatch(modalActions.hideModal());
    dispatch(digitalNoticeboardActions.getDigitalNoticeboards({ by_account: buildingProfile?.id }));
  };

  const handleTemplateTypeChange = (value) => {
    setSelectedTemplate(value);
  };

  const editForm = () => {
    const SelectedForm = noticeboard?.remote_name
      ? TEMPLATE_COMPONENTS[noticeboard?.remote_name]
      : null;

    if (SelectedForm) {
      return (
        <SelectedForm
          currentUser={currentUser}
          dispatch={dispatch}
          noticeboard={noticeboard}
          buildingProfile={buildingProfile}
          screenId={selectedScreen?.value}
          onAfterSubmit={onAfterSubmit}
        />
      );
    }

    return null;
  };

  const createForm = () => {
    const SelectedForm = selectedTemplate?.value
      ? TEMPLATE_COMPONENTS[selectedTemplate?.value]
      : null;

    if (SelectedForm) {
      return (
        <div className='digital-noticeboard-container'>
          <div className='digital-noticeboard-form-container'>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='screen'>Screen</label>
              </div>
              <div className='form__control'>
                <AsyncSelect
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
                  blurInputOnSelect
                  onChange={(o) => setSelectedScreen(o)}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder='Search screen name, reference ID...'
                />
              </div>
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='screen'>Template</label>
              </div>
              <div className='form__control'>
                <Select
                  style={{ marginTop: '10px' }}
                  className='select'
                  name='templateType'
                  classNamePrefix='react-select'
                  blurInputOnSelect
                  options={list}
                  onChange={handleTemplateTypeChange}
                />
              </div>
            </div>
            <SelectedForm
              currentUser={currentUser}
              dispatch={dispatch}
              noticeboard={selectedTemplate}
              screenId={selectedScreen?.value}
              setNoticeboardFormData={setNoticeboardFormData}
              onAfterSubmit={onAfterSubmit}
            />
          </div>

          <DigitalNoticeboardPreview digitalNoticeboard={noticeboardFormData} />
        </div>
      );
    }

    return null;
  };

  const modalBody = () => {
    if (listLoading) {
      return <Loading componentLoad />;
    }

    if (editing) {
      return editForm();
    }

    return createForm();
  };

  return (
    <ModalContainer
      title={noticeboard ? 'Edit Noticeboard' : 'New Noticeboard'}
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        className: 'c-modal__container c-modal__container--lg digital-notice-board-modal'
      }}
    >
      <div className='c-modal__body' style={{ paddingTop: '20px' }}>
        {!noticeboard && (
          <div className='alert alert--warning'>
            Notices may not be published to screens instantly due to a synchronisation requirement.
            If you have any concerns please &nbsp;
            <a href='https://help.smata.com/hc/en-us/requests/new' style={{ color: 'blue' }}>
              Contact support
            </a>
          </div>
        )}
        {modalBody()}
      </div>
    </ModalContainer>
  );
};

export default connect((state) => state.digitalNoticeboardTemplates)(
  CreateEditDigitalNoticeboardModal
);
