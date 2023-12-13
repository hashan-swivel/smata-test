import React, { useState, useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Link } from '../Link';
import { Avatar } from '../Avatar';
import { userFullName } from '../../../utils/userHelpers';
import { addAttachment } from '../../../actions';
import { contactConstants } from '../../../constants';
import ModalContainer from './ModalContainer';

import './BuildingDirectoryModal.module.scss';

const menuPortalTarget = typeof window !== 'undefined' ? document.getElementById('__next') : null;

const BuildingDirectoryModal = ({ dispatch }) => {
  const buildingProfile = useSelector((state) => state.buildingProfile);
  const { contacts, locations, managers, site_plan_id: spNumber } = buildingProfile;
  const [byKeyword, setByKeyword] = useState('');
  const [byRole, setByRole] = useState(contactConstants.ALL_ROLE_OPTIONS[0]);
  const [filterResults, setFilterResults] = useState([]);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const groupedContacts = useMemo(() => {
    let t = [];

    const { strata_manager: strataManager, building_manager: buildingManager } = managers;
    const managerArr = [strataManager, buildingManager].filter(
      (e) => e !== null && e !== undefined
    );

    if (managerArr?.length > 0) {
      managerArr.forEach((c) => {
        if (c.user_id === undefined || c.user_id === null) {
          t.push({ ...c, roles: [c.role] });
        } else {
          const foundSameManager = t.find((e) => e.user_id === c.user_id);
          if (foundSameManager) {
            foundSameManager.roles = [...new Set(foundSameManager.roles.concat(c.role))].sort();
          } else {
            t.push({ ...c, roles: [c.role] });
          }
        }
      });
    }

    if (contacts?.length > 0) {
      contacts.forEach((c) => {
        if (c.user_id === undefined || c.user_id === null) {
          t.push({ ...c, roles: [c.role] });
        } else {
          const foundSameContactAtSameLot = t.find(
            (e) => e.user_id === c.user_id && e.lot_number === c.lot_number
          );
          if (foundSameContactAtSameLot) {
            foundSameContactAtSameLot.roles = [
              ...new Set(foundSameContactAtSameLot.roles.concat(c.role))
            ].sort();
          } else {
            t.push({ ...c, roles: [c.role] });
          }
        }
      });
    }

    return t;
  }, [contacts, managers]);

  useEffect(() => {
    const results = groupedContacts.filter((elem) => {
      let matchByKeyword = true;
      let matchByRole = true;

      if (byKeyword.length > 1) {
        matchByKeyword = userFullName(elem.first_name, elem.last_name)
          .toLowerCase()
          ?.includes(byKeyword.toLowerCase());
      }

      if (byRole?.value?.length > 1) {
        matchByRole = elem.roles.includes(byRole.value);
      }

      return matchByKeyword && matchByRole;
    });

    setFilterResults(results);
  }, [contacts, byKeyword, byRole]);

  const handleSendMessage = (userContact) => {
    const attachedUser = currentUser.id === userContact.user_id ? [] : [userContact];
    const attachment = {
      spNumber,
      locations,
      users: attachedUser,
      can_message: buildingProfile?.can_message
    };

    window.localStorage.setItem('message_attachment', JSON.stringify(attachment));
    dispatch(addAttachment(attachment));
  };

  const contactResultItem = (c) => (
    <div className='contact-result-item' key={`${c.id}_${c.lot_number}`}>
      <div className='contact-result-item--avatar'>
        <Avatar {...c} size='small' />
      </div>
      <div className='contact-result-item--details'>
        <div
          className='contact-result-item--full-name'
          title={userFullName(c.first_name, c.last_name)}
        >
          {userFullName(c.first_name, c.last_name)}
        </div>
        {(c.lot_number || c.unit_number) && (
          <div className='contact-result-item--lot-and-unit'>
            {c.lot_number ? `Lot: ${c.lot_number}` : null}{' '}
            {c.unit_number ? ` Unit: ${c.unit_number}` : null}
          </div>
        )}
        {c.roles.map((r) => (
          <div
            className='badge badge--secondary'
            style={{ fontSize: '90%', marginRight: '10px' }}
            key={`${c.id}_${c.lot_number}_${r}`}
          >
            {contactConstants.ALL_ROLE_OPTIONS.find((o) => o.value === r)?.label || 'N/A'}
          </div>
        ))}
      </div>
      <div className='contact-result-item--message-action'>
        {c?.is_displayed_in_contact_list ? (
          <Link
            classNameProp='send-message-link'
            href='/src/pages/v1/messages'
            query={{ createMessage: true }}
            onClick={() => handleSendMessage(c)}
          >
            <FontAwesomeIcon icon={faCommentDots} size='2x' title='Send Message' color='#28a745' />
          </Link>
        ) : (
          <FontAwesomeIcon icon={faCommentDots} size='2x' title='Private Profile' color='#797979' />
        )}
      </div>
    </div>
  );

  const contactFilterResult = () => {
    if (filterResults.length === 0) {
      return (
        <div className='contact-result-list'>
          <h3 style={{ textAlign: 'center', padding: '10px 0' }}>No Results</h3>
        </div>
      );
    }

    return (
      <div className='contact-result-list'>{filterResults.map((c) => contactResultItem(c))}</div>
    );
  };

  return (
    <ModalContainer
      title='Building Directory'
      reactModalProps={{ className: 'c-modal__container' }}
    >
      <form>
        <div className='c-modal__body'>
          <p>
            This is the list of contacts linked to this Plan Number. You can manage your privacy and
            message settings{' '}
            {currentUser?.isStrataMember ? (
              <Link
                href='/src/pages/v1/settings?section=privacy'
                classNameProp='bold'
                target='_blank'
              >
                here
              </Link>
            ) : (
              <a
                href={`${currentUser?.baseUrl}/user/settings/edit`}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#4A90E2', textDecoration: 'underline' }}
              >
                here
              </a>
            )}
          </p>
          <fieldset className='fieldset'>
            <div className='form__group' style={{ display: 'flex' }}>
              <div className='form__control' style={{ flex: '50%', paddingRight: '5px' }}>
                <label htmlFor='byKeyword'>Search</label>
                <input
                  type='text'
                  name='byKeyword'
                  className='input'
                  defaultValue={byKeyword}
                  placeholder='Search name...'
                  onChange={(e) => setByKeyword(e.target.value)}
                />
              </div>

              <div className='form__control' style={{ flex: '50%', paddingLeft: '5px' }}>
                <label htmlFor='byRole'>Role</label>
                <Select
                  name='byRole'
                  options={contactConstants.ALL_ROLE_OPTIONS}
                  value={byRole}
                  defaultValue=''
                  onChange={(o) => setByRole(o)}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={menuPortalTarget}
                  placeholder='Select role'
                />
              </div>
            </div>
          </fieldset>
          {contactFilterResult()}
        </div>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(BuildingDirectoryModal);
