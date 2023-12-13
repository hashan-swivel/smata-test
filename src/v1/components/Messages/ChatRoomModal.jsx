import React, { useEffect, useState, useRef } from 'react';
import Router from 'next/router';
import Select from 'react-select';
import { connect, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import ModalContainer from '../Modals/ModalContainer';
import { addAttachment, flashActions, modalActions } from '../../../actions';
import { axiosInstance, userOptionObj } from '../../../utils';
import { UserOption, UserMultiValueLabel } from '../Form';

import '../Form/Fields/ReactSelect.module.scss';

const ChatRoomModal = ({
  dispatch,
  chatRoomId,
  initializedBuilding,
  initializedDocument,
  initializedSubject,
  initializedMessage,
  initializedUsers,
  setActiveState
}) => {
  const menuPortalTarget = typeof window !== 'undefined' ? document.getElementById('__next') : null;
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({});

  const [selectedBuilding, setSelectedBuilding] = useState(initializedBuilding);
  const [selectedDocument, setSelectedDocument] = useState(initializedDocument);
  const [selectedUsers, setSelectedUsers] = useState(initializedUsers || []);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [committee, setCommittee] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [buildingUsers, setBuildingUsers] = useState([]);
  const [showMessageWarning, setShowMessageWarning] = useState(false);

  const buildingOptions = useSelector((state) => state.spNumbers.orgSpNumbers);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const managerUsers = useSelector((state) => state.users.orgUsers) || [];
  const isFirstRun = useRef(true);
  const firstRender = useRef(true);
  const editing = !!chatRoomId;

  useEffect(() => {
    const selectedSpNumber = selectedBuilding?.value;

    if (selectedSpNumber) {
      if (editing || selectedBuilding?.can_message) {
        fetchBuildingDocuments(selectedSpNumber);
        fetchBuildingContacts(selectedSpNumber);
        setShowMessageWarning(false);
      } else {
        setDocumentOptions([]);
        setBuildingUsers([]);
        setShowMessageWarning(true);
      }

      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      setSelectedDocument(null);
      setSelectedUsers([]);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    const filteredUsers = [];
    const filteredOwner = [];
    const filteredCommitteeMembers = [];
    const organisationUserIds = managerUsers.map((i) => i.id);

    buildingUsers.forEach((u) => {
      if (
        u.role === 'strata_member' ||
        ((u.role === 'strata_manager' || u.role === 'building_manager') &&
          !organisationUserIds.includes(u.id))
      ) {
        filteredUsers.push(u);

        if (
          u.contact_roles?.includes('owner_landlord') ||
          u.contact_roles?.includes('owner_occupier')
        ) {
          filteredOwner.push(userOptionObj(u));
        }

        if (u.contact_roles?.includes('committee_member')) {
          filteredCommitteeMembers.push(userOptionObj(u));
        }
      }
    });

    setCommitteeList(filteredCommitteeMembers);
    setOwnerList(filteredOwner);
    if (currentUser?.isStrataMember) {
      setUserOptions(buildingUsers.map(userOptionObj));
    } else {
      setUserOptions(managerUsers.concat(filteredUsers).map(userOptionObj));
    }
  }, [managerUsers, buildingUsers]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      let addedStrataMemberList = [];
      let removedStrataMemberList = [];

      // owner and committee can be undefined as initial state (represents for un-touch)
      if (owner === true) {
        addedStrataMemberList = ownerList.filter((c) => c.is_displayed_in_contact_list);
      }
      if (committee === true) {
        const strataMemberIds = addedStrataMemberList.map((i) => i.id);
        committeeList.forEach((c) => {
          if (!strataMemberIds.includes(c.id) && c.is_displayed_in_contact_list) {
            addedStrataMemberList.push(c);
          }
        });
      }

      if (owner === false) removedStrataMemberList = ownerList;
      if (committee === false) {
        const strataMemberIds = removedStrataMemberList.map((i) => i.id);
        committeeList.forEach((c) => {
          if (!strataMemberIds.includes(c.id)) removedStrataMemberList.push(c);
        });
      }

      const removedStrataMemberIds = removedStrataMemberList.map((i) => i.id);
      const currentSelectedUsers = [...selectedUsers].filter(
        (c) => !removedStrataMemberIds.includes(c.id)
      );
      const currentSelectedUserIds = currentSelectedUsers.map((i) => i.id);

      addedStrataMemberList.forEach((c) => {
        if (!currentSelectedUserIds.includes(c.id)) currentSelectedUsers.push(c);
      });

      setSelectedUsers(currentSelectedUsers);
    }
  }, [committee, owner]);

  const fetchBuildingDocuments = async (sp) => {
    const basePath = currentUser?.document_permissions?.['document.view_all']
      ? '/v1/documents/organisation_documents'
      : '/v1/documents';

    await axiosInstance
      .get(`${basePath}?organisation_id=${currentUser.organisation_id}&sp_number=${sp}`)
      .then((res) => {
        setDocumentOptions(
          res.data.documents.map((doc) => ({
            value: doc.id,
            name: doc.filename,
            label: doc.display_name
          }))
        );
      })
      .catch((error) => dispatch(flashActions.showError(error)));
  };

  const fetchBuildingContacts = async (sp) => {
    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(sp)}/building_contacts`)
      .then((res) => setBuildingUsers(res.data))
      .catch((error) => dispatch(flashActions.showError(error)));
  };

  const onSubmit = async (data) => {
    if (!validation()) return;

    if (editing) {
      const body = {
        name: data.subject || 'No Subject',
        user_ids: selectedUsers.map((i) => i.id),
        attachment_ids: selectedDocument?.value ? [selectedDocument.value] : []
      };
      await axiosInstance
        .put(`/v1/chat_rooms/${chatRoomId}`, body)
        .then((res) => {
          dispatch(modalActions.hideModal());
          dispatch(addAttachment({}));
          Router.reload();
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
        });
    } else {
      const body = {
        name: data.subject || 'No Subject',
        messages_attributes: data.message ? [{ body: data.message }] : [],
        location_id: selectedBuilding?.locations?.[0]?.id,
        chat_room_users_attributes: selectedUsers.map((i) => ({ user_id: i.id })),
        chat_room_attachments_attributes: selectedDocument?.value
          ? [{ attachment_id: selectedDocument.value }]
          : []
      };

      await axiosInstance
        .post('/v1/chat_rooms', body)
        .then((res) => {
          setActiveState(res.data.id);
          dispatch(modalActions.hideModal());

          Router.push(`/messages?id=${res.data.id}&submitted=true`);
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
        });
    }
  };

  // TODO: Use React Form Hook validation instead.
  const validation = () => {
    if (!selectedBuilding?.value) {
      dispatch(flashActions.show('Building must be present', 'error'));
      return false;
    }

    if (!selectedUsers || selectedUsers.length === 0) {
      dispatch(flashActions.show('Contacts must be present', 'error'));
      return false;
    }

    return true;
  };

  return (
    <ModalContainer
      title={editing ? 'Edit Channel' : 'New Channel'}
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting}>
          <div className='c-modal__body'>
            {showMessageWarning && (
              <div className='form__group'>
                <div className='form__control alert alert--warning'>
                  Your strata manager has not activated this feature for your building. For more
                  information, &nbsp;
                  <a
                    href='https://help.smata.com/hc/en-us/requests/new'
                    className='default--link'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    contact support.
                  </a>
                </div>
              </div>
            )}
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='location'>Select Building</label>
              </div>
              <div className='form__control'>
                <Controller
                  name='location'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      blurOnSelect
                      isDisabled={editing}
                      name='location'
                      options={buildingOptions}
                      value={selectedBuilding}
                      onChange={(value) => setSelectedBuilding(value)}
                      classNamePrefix='react-select'
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      menuPortalTarget={menuPortalTarget}
                      placeholder='Search by address or plan Id'
                    />
                  )}
                />
              </div>
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='document'>Select File</label>
              </div>
              <div className='form__control'>
                <Controller
                  name='document'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      blurOnSelect
                      options={documentOptions}
                      value={selectedDocument}
                      onChange={(value) => setSelectedDocument(value)}
                      classNamePrefix='react-select'
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      menuPortalTarget={menuPortalTarget}
                      placeholder='Add associated file to message'
                    />
                  )}
                />
              </div>
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='contacts'>Select Contacts</label>
              </div>
              <div className='form__control'>
                <Controller
                  name='contacts'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={userOptions}
                      value={selectedUsers}
                      onChange={(values) => setSelectedUsers(values || [])}
                      isMulti
                      components={{ Option: UserOption, MultiValueLabel: UserMultiValueLabel }}
                      classNamePrefix='react-select'
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      menuPortalTarget={menuPortalTarget}
                      placeholder='Include contacts in the message'
                    />
                  )}
                />
              </div>
            </div>
            <div className='form__group form__group--inline'>
              <div className='form__control' style={{ flex: 1 }}>
                <input
                  className='checkbox'
                  type='checkbox'
                  id='committeeMembers'
                  value='false'
                  onChange={(e) => setCommittee(e.target.checked)}
                />
                <label className='checkbox-label' htmlFor='committeeMembers'>
                  Committee Members
                </label>
              </div>
              <div className='form__control' style={{ flex: 1 }}>
                <input
                  className='checkbox'
                  type='checkbox'
                  id='owners'
                  value='false'
                  onChange={(e) => setOwner(e.target.checked)}
                />
                <label className='checkbox-label' htmlFor='owners'>
                  Owners
                </label>
              </div>
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='subject'>Subject</label>
              </div>
              <input
                className='form__control'
                {...register('subject')}
                type='text'
                name='subject'
                id='subject'
                defaultValue={initializedSubject}
              />
            </div>
            {!editing && (
              <div className='form__group'>
                <div className='form__control'>
                  <label htmlFor='message'>Message</label>
                </div>
                <textarea
                  className='form__control'
                  {...register('message')}
                  required
                  name='message'
                  id='message'
                  defaultValue={initializedMessage}
                />
              </div>
            )}
          </div>
          <div className='c-modal__footer'>
            <button
              type='button'
              className='button button--link-dark'
              onClick={() => dispatch(modalActions.hideModal())}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='button button--primary'
              style={{ marginLeft: '10px', minWidth: '100px' }}
            >
              {editing ? 'Edit' : 'Create'}
            </button>
          </div>
        </fieldset>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(ChatRoomModal);
