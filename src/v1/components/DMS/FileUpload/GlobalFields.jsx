import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { autofill } from 'redux-form';
import { addLabelToSpList, axiosInstance, userOptionObj, addLabelValues } from '../../../../utils';
import { Fields } from '../../Form';
import { getSpContacts } from '../../../../actions/users';
import { getLotNumbers } from '../../../../actions/buildingProfile';

const fields = (
  contactsState,
  users,
  spNumbers,
  handleChangeSp,
  handleChangeCategory,
  categories,
  lotNumbers,
  type
) => [
  {
    name: '[global]spNumber',
    noLabel: true,
    component: 'react-select',
    placeholder: 'Plan Number',
    classNames: 'sp-number',
    options: addLabelToSpList(spNumbers),
    customOnChange: handleChangeSp
  },
  {
    name: `[global]validSpNumber`,
    type: 'hidden',
    classNames: 'hidden-field',
    noLabel: true
  },
  {
    name: '[global]docCategory',
    noLabel: true,
    placeholder: 'Category',
    component: 'react-select',
    classNames: 'doc-category',
    options: categories, // Loading categories from helper.js
    customOnChange: handleChangeCategory,
    isHidden: type === 'invoice'
  },
  {
    name: '[global]lotNumber',
    noLabel: true,
    placeholder: 'Lot',
    component: 'react-select',
    options: lotNumbers,
    isHidden: lotNumbers?.length === 0
  },
  {
    name: '[global]sharedWith',
    label: 'Share with',
    component: 'react-select',
    options: users,
    isMulti: true,
    userList: true,
    placeholder: 'Select...',
    prepopulated: contactsState
  },
  {
    name: '[global]everyone',
    component: 'checkbox',
    noLabel: true,
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
    name: '[global]owners',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'owners',
        label: 'Owners'
      }
    ],
    classNames: `owner-checkbox active`
  },
  {
    name: '[global]tenants',
    component: 'checkbox',
    noLabel: true,
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
    name: '[global]agents',
    component: 'checkbox',
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
    name: '[global]committeeMembers',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'committeeMembers',
        label: 'Committee Members'
      }
    ],
    classNames: `committee-checkbox active`
  }
];

export const GlobalFields = ({
  submitFailed,
  syncErrors,
  values,
  formName,
  spNumbers,
  categories,
  type
}) => {
  const [showFields, setShowFields] = useState(false);
  const orgUsersList = useSelector((state) => state.users.orgUsers);
  const spContactsList = useSelector((state) => state.users.contacts);
  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const [allUsersList, setAllUsersList] = useState([]);
  const [customUsers, setCustomUsers] = useState([]);
  const [contactsState, setContactsState] = useState([]);
  const dispatch = useDispatch();
  const { spNumber, everyone, committeeMembers, owners, tenants, agents } = values.global;
  const [globalSpNumber, setGlobalSpNumber] = useState(values?.global?.spNumber?.name);
  const [globalDocCategory, setGlobalDocCategory] = useState(values?.global?.docCategory?.label);

  useEffect(() => {
    if (globalSpNumber && globalDocCategory) {
      values?.file?.map((file, index) => {
        const globalSuggestFileName = `${globalSpNumber} - ${globalDocCategory} - ${file?.filename}`;
        dispatch(autofill(formName, `file[${index}].suggestFileName`, globalSuggestFileName));
      });
    }
  }, [globalSpNumber, globalDocCategory]);

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
    dispatch(autofill('files', 'global.sharedWith', contactsState));
  }, [contactsState]);

  const lotNumbers = useMemo(
    () =>
      buildingProfileState.lotNumbers?.length > 0
        ? addLabelValues(buildingProfileState.lotNumbers)
        : [],
    [buildingProfileState.lotNumbers]
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

  useEffect(() => {
    if (globalSpNumber) {
      dispatch(getLotNumbers(globalSpNumber));
    }
  }, [globalSpNumber]);

  const handleChangeSp = (value) => {
    dispatch(autofill(formName, `[global]spNumber`, value));
    dispatch(autofill(formName, `[global]validSpNumber`, true));
    setGlobalSpNumber(value?.name);
  };

  const handleChangeCategory = (value) => {
    setGlobalDocCategory(value?.label);
  };

  return (
    <>
      <div className='global-fields'>
        <span
          role='presentation'
          className='icon-after icon-chevron-down-dark label'
          onClick={() => setShowFields(!showFields)}
        >
          Global Settings
        </span>
      </div>
      <p className={`global-fields-text ${showFields ? 'active' : 'inactive'}`}>
        These will apply to all files to be uploaded and replace any individual file settings!
      </p>
      {showFields && (
        <Fields
          fields={fields(
            contactsState,
            allUsersList,
            spNumbers,
            handleChangeSp,
            handleChangeCategory,
            categories,
            lotNumbers,
            type
          )}
          submitFailed={submitFailed}
          syncErrors={syncErrors}
          values={values}
          containerClass='global-inputs'
          onChange={onContactsChange}
        />
      )}
    </>
  );
};
