import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { autofill } from 'redux-form';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance, userOptionObj } from '../../../../utils';
import { flashActions } from '../../../../actions';
import { Fields } from '../../Form';

import Accordion from '../InvoiceView/Accordion';

import './SharedWith.module.scss';

// Fields array
const fields = (allUsers) => [
  {
    name: 'sharedWith',
    label: 'Select who to share this document with',
    component: 'react-select',
    userList: true,
    isMulti: true,
    options: allUsers
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
    classNames: 'owner-checkbox'
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
    classNames: 'committee-checkbox'
  }
];

const addToPopularField = (addToPopular, setAddToPopular) => [
  {
    name: 'popular',
    label: 'Add to popular documents',
    component: 'toggle',
    onChange: setAddToPopular,
    checked: addToPopular,
    noLabel: true
  }
];

const title = (
  <>
    <span style={{ marginRight: '5px' }}>Shared with:</span>
    <Tooltip
      arrow
      title='These are the users that this document has been shared with. The invoice approvers cannot be removed from this section'
      position='bottom'
      animation='fade'
      theme='light'
    >
      <FontAwesomeIcon icon={faInfoCircle} />
    </Tooltip>
  </>
);

export const SharedWith = ({ users, values, syncErrors, submitFailed, formName }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [addToPopular, setAddToPopular] = useState(false);
  const { committeeMembers, owners, spNumber, popular } = values;
  const [selectedUsers, setSelectedUsers] = useState(users || []);
  const [userOptions, setUserOptions] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [buildingUsers, setBuildingUsers] = useState([]);
  const managerUsers = useSelector((state) => state.users.orgUsers) || [];
  const isFirstRun = useRef(true);
  const firstRender = useRef(true);

  useEffect(() => {
    if (spNumber) {
      fetchBuildingContacts(spNumber);

      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
      setSelectedUsers([]);
    }
  }, [spNumber]);

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
      if (owners === true) {
        addedStrataMemberList = ownerList.filter((c) => c.is_displayed_in_contact_list);
      }
      if (committeeMembers === true) {
        const strataMemberIds = addedStrataMemberList.map((i) => i.id);
        committeeList.forEach((c) => {
          if (!strataMemberIds.includes(c.id) && c.is_displayed_in_contact_list) {
            addedStrataMemberList.push(c);
          }
        });
      }

      if (owners === false) removedStrataMemberList = ownerList;
      if (committeeMembers === false) {
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
      dispatch(autofill(formName, 'sharedWith', currentSelectedUsers));
    }
  }, [committeeMembers, owners]);

  const fetchBuildingContacts = async (sp) => {
    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(sp)}/building_contacts`)
      .then((res) => setBuildingUsers(res.data))
      .catch((error) => dispatch(flashActions.showError(error)));
  };

  useEffect(() => {
    if (popular) setAddToPopular(popular);
  }, [popular]);

  return (
    <Accordion title={title}>
      <div className='document-view-block-content'>
        <Fields
          fields={fields(userOptions)}
          values={values}
          syncErrors={syncErrors}
          submitFailed={submitFailed}
          containerClass='shared-with-field'
        />
        <Fields
          fields={addToPopularField(addToPopular, setAddToPopular)}
          submitFailed={submitFailed}
          syncErrors={syncErrors}
          values={values}
          containerClass='additional-inputs add-to-inputs'
        />
      </div>
    </Accordion>
  );
};
