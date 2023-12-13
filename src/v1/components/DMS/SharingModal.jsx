import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, autofill, Form } from 'redux-form';
import { Modal } from '../index';
import { Fields } from '../Form';
import { axiosInstance } from '../../../utils/axiosInstance';
import { userOptionObj } from '../../../utils/addLabelValue';
import './SharingModal.module.scss';

const formName = 'sharing';

const fields = (users, contactsState) => [
  {
    name: 'sharedWith',
    noLabel: true,
    component: 'react-select',
    options: users,
    isMulti: true,
    userList: true,
    prepopulated: contactsState,
    placeholder: `${users.length ? 'Select...' : 'Loading...'}`
  },
  {
    name: 'everyone',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'everyone',
        label: 'Everyone'
      }
    ],
    classNames: `everyone-checkbox ${users.length ? 'active' : 'inactive'}`,
    isHidden: true
  },
  {
    name: 'owners',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'owners',
        label: 'Owners'
      }
    ],
    classNames: `owner-checkbox ${users.length ? 'active' : 'inactive'}`
  },
  {
    name: 'tenants',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'tenants',
        label: 'Tenants'
      }
    ],
    classNames: `tenant-checkbox ${users.length ? 'active' : 'inactive'}`,
    isHidden: true
  },
  {
    name: 'agents',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'agents',
        label: 'Agents'
      }
    ],
    classNames: `agent-checkbox ${users.length ? 'active' : 'inactive'}`,
    isHidden: true
  },
  {
    name: 'committeeMembers',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'committeeMembers',
        label: 'Committee Members'
      }
    ],
    classNames: `committee-checkbox ${users.length ? 'active' : 'inactive'}`
  }
];

const SharingForm = ({
  docId,
  spNumber,
  setShowModal,
  handleSubmit,
  submitting,
  additionalUsers,
  ownerId
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);
  const [spContacts, setSpContacts] = useState([]);
  const [creator, setCreator] = useState();

  const [contactsState, setContactsState] = useState(additionalUsers || []);
  const [customUsers, setCustomUsers] = useState(additionalUsers || []);
  const formState = useSelector((state) => state.form[formName]) || {
    syncErrors: {},
    values: {}
  };
  const { syncErrors, values } = formState;
  const { everyone, committeeMembers, owners, tenants, agents } = values;
  const dispatch = useDispatch();

  // Create users/contacts dropdown list on mount
  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axiosInstance.get('/v1/users', {
        params: {
          user_role: 'strata_manager',
          user_state: ['active', 'invited', 'imported']
        }
      });
      const mappedUsers = data.users.map(userOptionObj);
      setOrgUsers(mappedUsers);
    };
    const getContacts = async () => {
      const { data } = await axiosInstance(`/v1/users/contacts?sp_number=${spNumber}`);
      const mappedActiveContacts = data.contacts
        .filter((contact) => contact.user_id)
        .map(userOptionObj);
      setSpContacts(mappedActiveContacts);
    };

    getUsers();
    getContacts();
  }, []);

  useEffect(() => {
    const mergedUsersList = [...orgUsers, ...spContacts];

    // NOTE: There are duplicate contacts in the api response, same contact for different lots
    const filterUniqUsers = (list) => {
      const uniqUsers = [];
      const uniqUserIds = [];

      list.forEach((user) => {
        if (!uniqUserIds.includes(user.id)) {
          const mappedUser = userOptionObj(user);

          uniqUsers.push(mappedUser);
          uniqUserIds.push(user.id);
        }
      });
      return uniqUsers;
    };

    setAllUsers(filterUniqUsers(mergedUsersList));
  }, [orgUsers, spContacts]);

  useEffect(() => {
    const creatorExists = ownerId && ownerId !== 1;

    if (creatorExists) {
      const documentCreator = allUsers.find((user) => user.id === ownerId);
      setCreator(documentCreator);
    }
  }, [allUsers]);

  useEffect(() => {
    const sharedWith = [values ? values.sharedWith : []];
    const creatorInCustomUsers = creator && customUsers.find((user) => user.id === creator.id);
    const creatorIsNeeded = creator && !creatorInCustomUsers;

    // Set the contactsState to all users if "everyone" is toggled
    if (everyone) {
      setContactsState(allUsers);
    }
    // If everyone is false and any of the other checkboxes are true
    if (!everyone && (committeeMembers || owners || tenants || agents)) {
      if (committeeMembers) {
        sharedWith.push('committee_member');
      }
      if (owners) {
        sharedWith.push('owner_landlord');
        sharedWith.push('owner_occupier');
      }
      if (tenants) {
        sharedWith.push('tenant');
      }
      if (agents) {
        sharedWith.push('agent');
      }
      // If there are users that had been manually selected
      if (customUsers.length) {
        const userValues = [];
        // Add the value of each user to an array
        customUsers.forEach((user) => userValues.push(user.value));
        // Filter allUsers to find those that have a role matching one included in sharedWith array
        const filtered = allUsers.filter((user) => sharedWith.includes(user.role));
        // Check the filtered array and see if the user is already in the manually selected users array
        const filterFromCustom = filtered.filter((item) => !userValues.includes(item.value));
        const finalList = creatorIsNeeded
          ? [creator, ...customUsers, ...filterFromCustom]
          : [...customUsers, ...filterFromCustom];
        // Set the contact state as manually selected users and filtered users
        setContactsState(finalList);
      }
      // If there are no manually selected users
      if (!customUsers.length) {
        // Filter allUsers by those whose role matches one in the sharedWith array
        const filtered = allUsers.filter((user) => sharedWith.includes(user.role));
        const finalList = creatorIsNeeded ? [creator, ...filtered] : filtered;
        // Set the contactState as the filtered users array
        setContactsState(finalList);
      }
    }
    // If no boxes are checked (toggling from true to false)
    if (!everyone && !committeeMembers && !owners && !tenants && !agents) {
      // If there are users that have been manually selected
      if (customUsers.length >= 1) {
        const finalList = creatorIsNeeded ? [creator, ...customUsers] : customUsers;
        // Set the contactState to just those manually selected users
        setContactsState(finalList);
      }
      if (customUsers.length < 1) {
        // setCustomUsers(documentCreator);
        setContactsState(creatorIsNeeded ? [creator] : []);
      }
    }
  }, [allUsers, everyone, committeeMembers, owners, tenants, agents]);

  // When the user clicks to add or remove contact (not via group checkboxes)
  const onContactsChange = (value) => {
    const selectedUsers = value || [];
    const creatorIncluded = creator && selectedUsers.find((user) => user.id === creator.id);
    const newContactsState =
      creator && !creatorIncluded ? [creator, ...selectedUsers] : selectedUsers;
    setContactsState(newContactsState);

    const newCustomUsers = [...customUsers];

    if (!selectedUsers.length) {
      setCustomUsers([]);
    }

    if (selectedUsers.length) {
      // Add all selected users to customUsers
      if (!contactsState.length) {
        newCustomUsers.push(...newContactsState);
      }

      // Add only the newly selected user to customUsers
      if (contactsState.length && contactsState.length < selectedUsers.length) {
        const addedContact = selectedUsers.filter(
          (user) => !contactsState.some((contact) => contact.id === user.id)
        );
        newCustomUsers.push(...addedContact);
      }

      // Remove deselected user from customUsers
      if (contactsState.length > selectedUsers.length) {
        const removedContact = contactsState.filter(
          (user) => !selectedUsers.some((contact) => contact.id === user.id)
        );
        const userIndex = removedContact.length
          ? newCustomUsers.findIndex((user) => user.id === removedContact[0].id)
          : -1;
        if (userIndex !== -1) {
          newCustomUsers.splice(userIndex, 1);
        }
      }

      setCustomUsers(newCustomUsers);
    }
  };

  const onSubmit = async (value) => {
    try {
      const additionalUsersQuery = value
        ? value.sharedWith.map((user) => `additional_users_attributes[][id]=${user.id}`).join('&')
        : '';

      if (additionalUsersQuery) {
        await axiosInstance.put(`/v1/documents/${docId}?${additionalUsersQuery}`);
        setShowModal(false);
        Router.reload();
      }
    } catch (error) {
      console.error('Error @SharingModal onSubmit', error);
    }
  };

  useEffect(() => {
    dispatch(autofill(formName, 'sharedWith', contactsState));
  }, [contactsState]);

  return (
    <Modal
      active
      closeModal={(e) => {
        e.preventDefault();
        setShowModal(false);
      }}
      title='Share with'
    >
      <div className='sharing-modal-container'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Fields
            fields={fields(allUsers, contactsState)}
            values={values}
            onChange={onContactsChange}
            containerClass='sharing-modal'
          />
          <div className='button-container'>
            <button type='submit' className='button primary' disabled={submitting}>
              Share
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export const SharingModal = reduxForm({
  form: formName,
  destroyOnUnmount: true,
  initialValues: {
    sharedWith: []
  }
})(SharingForm);
