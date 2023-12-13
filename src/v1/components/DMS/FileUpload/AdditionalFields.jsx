import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { autofill } from 'redux-form';
import { Fields } from '../../Form';
import { addLabelToTags, userOptionObj, addLabelValues } from '../../../../utils';
import { getSpContacts } from '../../../../actions/users';

const invoiceFields = (index, contactsState, allUsers) => [
  {
    name: 'file',
    type: 'hidden',
    noLabel: true
  },
  {
    name: `file[${index}].invoicedPrice`,
    noLabel: true,
    component: 'input',
    type: 'text',
    placeholder: 'Invoiced price',
    classNames: 'doc-name'
  },
  {
    name: `file[${index}].invoicedNumber`,
    noLabel: true,
    component: 'input',
    type: 'text',
    placeholder: 'Invoice number',
    classNames: 'doc-name'
  },
  {
    name: `file[${index}].sharedWith`,
    label: 'Select who to share this document with',
    component: 'react-select',
    userList: true,
    isMulti: true,
    options: allUsers,
    classNames: 'dms-select-users',
    placeholder: 'Select...',
    prepopulated: contactsState
  }
];

const lotFields = (index, lotNumbers) => [
  {
    name: `file[${index}].lotNumber`,
    label: 'Select a lot',
    component: 'react-select',
    options: lotNumbers
  }
];

const documentFields = (index, contactsState, allUsers) => [
  {
    name: 'file',
    type: 'hidden',
    noLabel: true
  },
  {
    name: `file[${index}].sharedWith`,
    label: 'Select who to share this document with',
    component: 'react-select',
    userList: true,
    isMulti: true,
    options: allUsers,
    classNames: 'dms-select-users',
    placeholder: 'Select...',
    prepopulated: contactsState
  }
];

const tagsField = (index, tags) => [
  {
    name: 'file',
    type: 'hidden',
    noLabel: true
  },
  {
    name: `file[${index}].tags`,
    label: 'Select one or more tags for this document',
    component: 'react-select',
    isMulti: true,
    options: tags
  }
];

const groupFields = (index) => [
  {
    name: `file[${index}].everyone`,
    component: 'checkbox',
    noLabel: true,
    id: `everyone${index}`,
    options: [
      {
        value: 'everyone',
        label: 'Everyone'
      }
    ],
    classNames: `everyone-checkbox active`,
    isHidden: true
  },
  {
    name: `file[${index}].owners`,
    component: 'checkbox',
    noLabel: true,
    id: `owners${index}`,
    options: [
      {
        value: 'owners',
        label: 'Owners'
      }
    ],
    classNames: `owner-checkbox active`
  },
  {
    name: `file[${index}].tenants`,
    component: 'checkbox',
    noLabel: true,
    id: `tenants${index}`,
    options: [
      {
        value: 'tenants',
        label: 'Tenants'
      }
    ],
    classNames: `tenant-checkbox active`,
    isHidden: true
  },
  {
    name: `file[${index}].agents`,
    component: 'checkbox',
    id: `agents${index}`,
    noLabel: true,
    options: [
      {
        value: 'agents',
        label: 'Agents'
      }
    ],
    classNames: `agent-checkbox active`,
    isHidden: true
  },
  {
    name: `file[${index}].committeeMembers`,
    component: 'checkbox',
    noLabel: true,
    id: `committeeMembers${index}`,
    options: [
      {
        value: 'committeeMembers',
        label: 'Committee Members'
      }
    ],
    classNames: `committee-checkbox active`
  }
];

const addToFields = (
  index,
  addToNoticeboard,
  addToPopular,
  setAddToNoticeboard,
  setAddToPopular
) => [
  {
    name: `file[${index}].addToNoticeboard`,
    label: 'Add to noticeboard',
    component: 'toggle',
    onChange: setAddToNoticeboard,
    checked: addToNoticeboard,
    noLabel: true
  },
  {
    name: `file[${index}].addToPopular`,
    label: 'Add to popular documents',
    component: 'toggle',
    onChange: setAddToPopular,
    checked: addToPopular,
    noLabel: true
  }
];

const noticeboardFields = (index) => [
  {
    name: `file[${index}].noticeboardTitle`,
    label: 'Noticeboard title',
    component: 'input',
    type: 'text'
  },
  {
    name: `file[${index}].noticeboardText`,
    label: 'Noticeboard text',
    component: 'textarea'
  }
];

export const AdditionalFields = ({ submitFailed, syncErrors, values, index }) => {
  const [showFields, setShowFields] = useState(false);
  const orgUsersList = useSelector((state) => state.users.orgUsers);
  const spContactsList = useSelector((state) => state.users.contacts);
  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const [allUsersList, setAllUsersList] = useState([]);
  const [customUsers, setCustomUsers] = useState([]);
  const [contactsState, setContactsState] = useState([]);
  const [addToNoticeboard, setAddToNoticeboard] = useState(false);
  const [addToPopular, setAddToPopular] = useState(false);
  const currentFile = values.file[index];
  const { docCategory } = currentFile || {};
  const iconClass = showFields ? 'icon-minus-dark' : 'icon-plus-dark';
  const tagsLibrary = addLabelToTags(useSelector((state) => state.tags.tagsLibrary));
  const dispatch = useDispatch();
  const { spNumber, everyone, committeeMembers, owners, tenants, agents } = currentFile || {};

  useEffect(() => {
    if (spNumber) {
      dispatch(getSpContacts(spNumber.value));
    }

    setCustomUsers([]);
    setContactsState([]);
  }, [spNumber]);

  useEffect(() => {
    const activeContacts = spContactsList.filter((contact) => contact.user_id);
    const mergedUsersList = [...orgUsersList, ...activeContacts];

    // NOTE: There are many duplicate contacts in the api response, same contact for different lots
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

    setAllUsersList(filterUniqUsers(mergedUsersList));
  }, [orgUsersList, spContactsList]);

  useEffect(() => {
    const sharedWith = [];

    // Set the contactsState to all users if "everyone" is toggled
    if (everyone) {
      setContactsState(allUsersList);
    }
    // If everyone is false and any of the other checkboxes are true
    if (!everyone && (committeeMembers || owners || tenants || agents)) {
      if (committeeMembers) {
        sharedWith.push('committee_member');
      }
      if (owners) {
        sharedWith.push('owner');
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
        const filtered = allUsersList.filter((user) => sharedWith.includes(user.role));
        // Check the filtered array and see if the user is already in the manually selected users array
        const filterFromCustom = filtered.filter((item) => !userValues.includes(item.value));
        // Set the contact state as manually selected users and filtered users
        setContactsState([...customUsers, ...filterFromCustom]);
      }
      // If there are no manually selected users
      if (!customUsers.length) {
        // Filter allUsers by those whose role matches one in the sharedWith array
        const filtered = allUsersList.filter((user) => sharedWith.includes(user.role));
        // Set the contactState as the filtered users array
        setContactsState(filtered);
      }
    }
    // If no boxes are checked (toggling from true to false)
    if (!everyone && !committeeMembers && !owners && !tenants && !agents) {
      // If there are users that have been manually selected
      if (customUsers.length >= 1) {
        // Set the contactState to just those manually selected users
        setContactsState(customUsers);
      }
      if (customUsers.length < 1) {
        setContactsState([]);
      }
    }
  }, [allUsersList, everyone, committeeMembers, owners, tenants, agents]);

  useEffect(() => {
    dispatch(autofill('files', `file[${index}].sharedWith`, contactsState));
  }, [contactsState]);

  const selectFields = (data) => {
    if (docCategory && docCategory.value === 'invoice') {
      return invoiceFields(...data);
    }

    return documentFields(...data);
  };

  const lotNumbers = useMemo(
    () =>
      buildingProfileState.lotNumbers?.length > 0
        ? addLabelValues(buildingProfileState.lotNumbers)
        : [],
    [buildingProfileState]
  );

  // When the user clicks to add or remove contact (not via group checkboxes)
  const onContactsChange = (value) => {
    const selectedUsers = value || [];
    setContactsState(selectedUsers);

    const newCustomUsers = [...customUsers];

    if (!selectedUsers.length) {
      setCustomUsers([]);
    }

    if (selectedUsers.length) {
      // Add all selected users to customUsers
      if (!contactsState.length) {
        newCustomUsers.push(...selectedUsers);
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

  return (
    <>
      <div className='additional-fields'>
        <span
          role='presentation'
          className={`icon ${iconClass}`}
          onClick={() => setShowFields(!showFields)}
        />
      </div>
      <Fields
        fields={showFields && lotNumbers.length > 0 ? lotFields(index, lotNumbers) : null}
        submitFailed={submitFailed}
        syncErrors={syncErrors}
        values={values}
        containerClass='additional-inputs'
        onChange={onContactsChange}
      />
      {docCategory && docCategory.value !== 'invoice' ? (
        <Fields
          fields={showFields ? tagsField(index, tagsLibrary) : null}
          submitFailed={submitFailed}
          syncErrors={syncErrors}
          values={values}
          containerClass='additional-inputs'
        />
      ) : null}
      <Fields
        fields={showFields ? selectFields([index, contactsState, allUsersList]) : null}
        submitFailed={submitFailed}
        syncErrors={syncErrors}
        values={values}
        containerClass='additional-inputs'
        onChange={onContactsChange}
      />
      <Fields
        fields={showFields ? groupFields(index, currentFile.building, null, allUsersList) : null}
        submitFailed={submitFailed}
        syncErrors={syncErrors}
        values={values}
        containerClass='additional-inputs group-checkboxes'
      />
      <Fields
        fields={
          showFields
            ? addToFields(
                index,
                addToNoticeboard,
                addToPopular,
                setAddToNoticeboard,
                setAddToPopular
              )
            : null
        }
        submitFailed={submitFailed}
        syncErrors={syncErrors}
        values={values}
        containerClass='additional-inputs add-to-inputs'
      />
      <Fields
        fields={showFields && values.file[index].addToNoticeboard ? noticeboardFields(index) : null}
        submitFailed={submitFailed}
        syncErrors={syncErrors}
        values={values}
        containerClass='additional-inputs noticeboard-fields'
      />
    </>
  );
};
