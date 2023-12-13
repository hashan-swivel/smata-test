import React from 'react';
import { RightGrid, LeftGrid } from './index';
import './ProfileHeader.module.scss';

export const ProfileHeader = ({
  user,
  buildingProfile,
  openUploadModal,
  profileImages,
  setProfileImages,
  openImageModal,
  setBuildingProfile,
  buildingProfileHistories,
  updateBuildingProfileHistories,
  showRuleModal,
  dispatch
}) =>
  buildingProfile && (
    <div className='building-profile-header'>
      <div className='grid-wrapper building-layout-wrapper'>
        {/* LeftGrid is using all hard-coded info currently */}
        {/* Waiting on ability to upload image to profile, along with thumbs up/down functionality and rank within back end */}
        <LeftGrid
          user={user}
          buildingProfile={buildingProfile}
          openUploadModal={openUploadModal}
          profileImages={profileImages}
          setProfileImages={setProfileImages}
          openImageModal={openImageModal}
          setBuildingProfile={setBuildingProfile}
          buildingProfileHistories={buildingProfileHistories}
          updateBuildingProfileHistories={updateBuildingProfileHistories}
          showRuleModal={showRuleModal}
        />
        <RightGrid
          user={user}
          buildingProfile={buildingProfile}
          setBuildingProfile={setBuildingProfile}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
