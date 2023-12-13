import React, { useState } from 'react';
import { Avatar } from '../../Avatar';
import { axiosInstance } from '../../../../utils/axiosInstance';
import './RatingModal.module.scss';

export const RatingModal = (props) => {
  const {
    userForRating,
    typeToBeRated,
    spNumber,
    closeModal,
    setStrataManagerRating,
    setBuildingManagerRating,
    setUpdatingRatings,
    setBuildingProfile
  } = props;
  const [starsSelected, setStarsSelected] = useState(0);

  const totalStars = 5;

  const submitRating = async () => {
    try {
      const apiUrl = `/v1/building_profile/${encodeURIComponent(spNumber)}/rate?user_id=${
        userForRating.id
      }&vote=${starsSelected}&dimension=${typeToBeRated}`;
      await axiosInstance.put(apiUrl);
      closeModal();
      setUpdatingRatings(true);
      const { data } = await axiosInstance.get(
        `/v1/building_profile/${encodeURIComponent(spNumber)}`
      );
      setStrataManagerRating(data.strata_manager);
      setBuildingManagerRating(data.building_manager);
      setBuildingProfile(data);
      setUpdatingRatings(false);
    } catch (error) {
      console.error('Error @RatingModal submitRating', error);
    }
  };

  return (
    <div className='rating-modal-container'>
      <div className='avatar-name-container'>
        <Avatar {...userForRating} size='large' />
        <h3 className='rating-modal-title'>{userForRating.label}</h3>
      </div>
      <div className='rating-stars-container'>
        {[...Array(totalStars)].map((item, index) => (
          <span
            key={`${item} + ${index + 1}`}
            role='presentation'
            className={`star star-${item} icon icon-star-${
              index < starsSelected ? 'dark-filled' : 'dark'
            }`}
            onClick={() => {
              if (starsSelected === index + 1 && starsSelected !== 1) {
                setStarsSelected(index);
              } else setStarsSelected(index + 1);
            }}
          />
        ))}
      </div>
      <button type='button' className='button primary submit-review-button' onClick={submitRating}>
        Submit
      </button>
    </div>
  );
};
