import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Action, MainContacts, RatingModal, BuildingTeamUsers } from './index';
import { Modal } from '../../Modal';
import { Loading } from '../../Loading';
import { userOptionObj } from '../../../../utils';
import { modalActions } from '../../../../actions';

import './RightGrid.module.scss';

export const RightGrid = ({ user, buildingProfile, setBuildingProfile, dispatch }) => {
  const [modalShowing, setModalShowing] = useState();
  const [showModal, setShowModal] = useState(false);
  const [userForRating, setUserForRating] = useState();
  const [typeToBeRated, setTypeToBeRated] = useState();
  const [strataManagerRating, setStrataManagerRating] = useState();
  const [buildingManagerRating, setBuildingManagerRating] = useState();
  const [updatingRatings, setUpdatingRatings] = useState(false);
  const [showBuildingAlertArea, setShowBuildingAlertArea] = useState(true);

  const { building_team_users: buildingTeamUsers } = buildingProfile;
  const contacts = useSelector((state) => state.buildingProfile.contacts);
  const displayOnBuildingProfileUsers = buildingTeamUsers?.filter(
    (u) =>
      u?.user?.id !== buildingProfile?.strata_manager?.id &&
      u?.user?.id !== buildingProfile?.building_manager?.id
  );

  useEffect(() => {
    setShowBuildingAlertArea(
      buildingProfile?.action_required_invoices_count &&
        buildingProfile?.action_required_invoices_count !== 0
    );
  }, [buildingProfile?.action_required_invoices_count]);

  const openModal = (event, type) => {
    setModalShowing(type);
    if (event) event.preventDefault();
    setShowModal(true);
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
  };

  const closeAlert = () => {
    setShowBuildingAlertArea(false);
  };

  // Selecting either the directory, rules or rating modal
  const selectModalType = () => {
    if (modalShowing === 'rating') {
      return (
        <RatingModal
          userForRating={userForRating}
          typeToBeRated={typeToBeRated}
          spNumber={buildingProfile.site_plan_id}
          closeModal={closeModal}
          setStrataManagerRating={setStrataManagerRating}
          setBuildingManagerRating={setBuildingManagerRating}
          setUpdatingRatings={setUpdatingRatings}
          setBuildingProfile={setBuildingProfile}
        />
      );
    }
  };

  const renderMainContacts = () => (
    <>
      <MainContacts
        strataManager={
          buildingProfile.strata_manager &&
          userOptionObj(strataManagerRating || buildingProfile.strata_manager)
        }
        buildingManager={
          buildingProfile.building_manager &&
          userOptionObj(buildingManagerRating || buildingProfile.building_manager)
        }
        openModal={openModal}
        setUserForRating={setUserForRating}
        setTypeToBeRated={setTypeToBeRated}
        currentUser={user}
        spNumber={buildingProfile?.site_plan_id}
        locations={buildingProfile.locations}
        contacts={contacts}
        buildingProfile={buildingProfile}
      />
      {displayOnBuildingProfileUsers && displayOnBuildingProfileUsers.length > 0 && (
        <BuildingTeamUsers
          buildingProfile={buildingProfile}
          openModal={openModal}
          setUserForRating={setUserForRating}
          setTypeToBeRated={setTypeToBeRated}
          currentUser={user}
          buildingTeamUsers={displayOnBuildingProfileUsers}
        />
      )}
    </>
  );

  const buildingName = (buildingProfile.locations[0] || {}).building_name;

  return (
    <div className='header-building-info-container'>
      <Modal active={showModal} closeModal={closeModal}>
        {selectModalType()}
      </Modal>
      {buildingName && (
        <div className='right-component'>
          <h5 className='building-name h5'>({buildingProfile.locations[0].building_name})</h5>
        </div>
      )}
      <div className='right-component'>
        <h2 className='h2'>
          {buildingProfile.body_corporate_name && buildingProfile.body_corporate_name.length !== 0
            ? buildingProfile.body_corporate_name
            : buildingProfile.raw_site_plan_id}
        </h2>
        <h2 className='h2' style={{ marginBottom: '10px' }}>{buildingProfile.locations[0].location_name}</h2>
        {buildingProfile.state === 'not_managed' && (
          <div className={`badge badge--${buildingProfile.state}`}>
            <h2 className='h2' style={{ textTransform: 'uppercase' }}>
              {buildingProfile.state.replace(/_/g, ' ')}
            </h2>
          </div>
        )}
        {buildingProfile?.locations.length > 1 && (
          <button
            type='button'
            className='other-locations-button'
            onClick={() =>
              dispatch(
                modalActions.showModal('OTHER_BUILDING_LOCATIONS', {
                  locations: buildingProfile?.locations
                })
              )
            }
          >
            Other Addresses
          </button>
        )}
      </div>
      <div className='right-component'>
        <div className='building-alert-container'>
          {showBuildingAlertArea ? (
            <Action
              actions={buildingProfile.action_required_invoices_count}
              closeAlert={closeAlert}
            />
          ) : null}
        </div>
        <div className='building-main-contacts-container'>
          {updatingRatings ? (
            <div className='main-contacts-loading'>
              <Loading componentLoad />
            </div>
          ) : (
            renderMainContacts()
          )}
        </div>
      </div>
    </div>
  );
};
