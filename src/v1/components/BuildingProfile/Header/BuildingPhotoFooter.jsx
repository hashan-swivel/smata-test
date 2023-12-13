import React, { useEffect, useMemo, useState } from 'react';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { userConstants } from '../../../../constants';
import { postAlert } from '../../../../actions/alerts';
import { userOptionObj, axiosInstance } from '../../../../utils';
import { Modal } from '../../Modal';
import { modalActions } from '../../../../actions';
import RulesModal from '../BuildingRules/RulesModal';

import './BuildingPhotoFooter.module.scss';

export const BuildingPhotoFooter = ({
  buildingProfile,
  user,
  buildingProfileHistories,
  updateBuildingProfileHistories,
  showRuleModal
}) => {
  const dispatch = useDispatch();

  const [modalShowing, setModalShowing] = useState();
  const [showModal, setShowModal] = useState(false);
  const [organisationUsers, setOrganisationUsers] = useState([]);
  const [buildingManagerUsers, setBuildingManagerUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [buildingRulesData, setBuildingRulesData] = useState({});

  const { building_rules: buildingRules } = buildingProfile;
  const oneOffApprovers = buildingRules.one_off_invoices.approvers;

  useEffect(() => {
    if (showRuleModal === 'true') {
      setModalShowing('rules');
      setShowModal(true);
    }
  }, [showRuleModal]);

  useEffect(() => {
    if (buildingProfile.organisation_id) {
      const getOrganisationUsers = async () => {
        await axiosInstance
          .get('/v1/users', {
            params: {
              organisation_id: buildingProfile?.organisation_id,
              user_state: userConstants.NOTIFIABLE_STATES,
              user_role: userConstants.ORG_MANAGER_ROLES.join(',')
            }
          })
          .then((res) => setOrganisationUsers(res.data.users))
          .catch((error) => {
            dispatch(
              postAlert(`Error getting organisation users: ${error.response.data.message}`, 'error')
            );
          });
      };

      getOrganisationUsers();
    }
  }, [buildingProfile?.organisation_id]);

  useEffect(() => {
    if (buildingProfile?.site_plan_id) {
      const getBuildingManagerUsers = async () => {
        await axiosInstance
          .get('/v1/users', {
            params: {
              user_state: userConstants.NOTIFIABLE_STATES,
              building_managers_by_sp: buildingProfile?.site_plan_id
            }
          })
          .then((res) => setBuildingManagerUsers(res.data.users))
          .catch((error) => {
            dispatch(
              postAlert(`Error getting organisation users: ${error.response.data.message}`, 'error')
            );
          });
      };

      getBuildingManagerUsers();
    }
  }, [buildingProfile?.site_plan_id]);

  useEffect(() => {
    const orgUserIds = organisationUsers.map((u) => u.id);
    const filteredBuildingManagerUsers = buildingManagerUsers.filter(
      (bm) => !orgUserIds.includes(bm.id)
    );
    const userOptionsData = organisationUsers.concat(filteredBuildingManagerUsers);

    setUserOptions(
      userOptionsData.map((u) => userOptionObj(u)).sort((a, b) => (a.label >= b.label ? 1 : -1))
    );
  }, [organisationUsers, buildingManagerUsers]);

  // Setting the building rules data values to be passed to the building rules modal
  useEffect(() => {
    const internalApprovers = oneOffApprovers.filter((x) => x.approver_type === 'internal');
    const externalApprovers = oneOffApprovers.filter((x) => x.approver_type === 'external');
    const firstApprover = oneOffApprovers.filter((x) => x.first_approver === true);

    setBuildingRulesData({
      amountToApprove: buildingRules.one_off_invoices.external_approvers_needed,
      oneOffStampRequired: buildingRules.one_off_invoices.stamp_required,
      oneOffIntRequired: true,
      oneOffIntFirst: firstApprover.length ? [userOptionObj(...firstApprover)] : null,
      oneOffIntAmount: `$${buildingRules.one_off_invoices.amount_is_over_internal}`,
      oneOffIntApproval: internalApprovers.map(userOptionObj),
      oneOffExtRequired: externalApprovers.length >= 1,
      oneOffExtAmount: `$${buildingRules.one_off_invoices.amount_is_over_external}`,
      oneOffExtApproval: externalApprovers.map(userOptionObj)
    });
  }, [buildingProfile]);

  const openModal = (event, type) => {
    setModalShowing(type);
    if (event) event.preventDefault();
    setShowModal(true);
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
    setModalShowing(null);
  };

  const selectModalType = () => {
    if (modalShowing === 'rules') {
      return (
        <RulesModal
          buildingProfile={buildingProfile}
          closeModal={closeModal}
          organisationUsers={userOptions}
          formData={buildingRulesData}
          setFormData={setBuildingRulesData}
          buildingProfileHistories={buildingProfileHistories}
          updateBuildingProfileHistories={updateBuildingProfileHistories}
        />
      );
    }
  };

  const createWorkRequestHref = useMemo(() => {
    const nameSpace = user?.namespace;
    const location = buildingProfile.locations[0];

    if (nameSpace) {
      return `${user?.baseUrlWithNameSpace}/jobs/new?${queryString.stringify({
        location_id: location.id
      })}`;
    }
    const queryObj = {
      lat_lng: location.lat_lng,
      geocode_place_id: location.geocode_place_id,
      full_name: [user.first_name, user.last_name].join(' '),
      email: user.email,
      contact_number: user.phone_number
    };
    return `${user?.baseUrl}/jobs/new?${queryString.stringify(queryObj)}`;
  }, [user, buildingProfile]);

  return (
    <div className='header-building-image-footer'>
      <Modal active={showModal} closeModal={closeModal}>
        {selectModalType()}
      </Modal>
      {buildingProfile?.can_create_work_request && (
        <div className=''>
          <a
            href={createWorkRequestHref}
            target='_self'
            className='create-job-button button primary'
          >
            Create Work Request
          </a>
          <a
            href={createWorkRequestHref}
            target='_self'
            className='button primary create-job-button-circle'
            style={{ lineHeight: '1.5em', marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </a>
        </div>
      )}

      <div className='building-directory-container avatars right-component'>
        {buildingProfile?.can_view_building_directory && (
          <button
            type='button'
            className='building-rules-button'
            onClick={() => dispatch(modalActions.showModal('BUILDING_DIRECTORY'))}
          >
            View Directory
          </button>
        )}
        {buildingProfile?.can_view_building_rule && (
          <button
            type='button'
            className='building-rules-button'
            onClick={(e) => openModal(e, 'rules')}
          >
            Building Rules
          </button>
        )}
      </div>
    </div>
  );
};
