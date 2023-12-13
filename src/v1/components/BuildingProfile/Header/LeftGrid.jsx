import React, { useState, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { BuildingPhotoUpload, BuildingPhotoFooter } from './index';
import 'react-alice-carousel/lib/alice-carousel.css';
import { axiosInstance } from '../../../../utils';
import { DeleteModal } from '../../DeleteModal';
import './LeftGrid.module.scss';

export const LeftGrid = ({
  user,
  openUploadModal,
  profileImages,
  setProfileImages,
  buildingProfile,
  openImageModal,
  setBuildingProfile,
  buildingProfileHistories,
  updateBuildingProfileHistories,
  showRuleModal
}) => {
  const [startingIndex, setStartingIndex] = useState(0);

  const [imageId, setImageId] = useState();
  const [spId, setSpId] = useState();
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [deletion, setDeletion] = useState(false);

  useEffect(() => {
    const mainImageIndex = profileImages.imageList.findIndex((img) => img.is_main_image);
    const startIndex = mainImageIndex > -1 ? mainImageIndex : 0;
    setStartingIndex(startIndex);
  }, [profileImages]);

  const responsive = {
    0: { items: 1 },
    660: { items: 1 },
    1024: { items: 1 }
  };

  const makeMainImage = (imageId, spId) => {
    axiosInstance
      .put(
        `/v1/building_profile/${encodeURIComponent(
          spId
        )}/set_main_image?profile_image_id=${imageId}`
      )
      .then((res) => {
        const updatedImages = profileImages.imageList.map((image) => {
          if (image.id === res.data.id) {
            return res.data;
          }
          return { ...image, is_main_image: false };
        });

        setProfileImages(updatedImages);
      });
  };

  const canAddImage = user.isSystemManager || user.isTenantManager;
  const canRemoveImage = profileImages.imageList.length > 1 && canAddImage;

  const removeImageHandler = (imageId, spId) => {
    setDeleteModal(true);
    setImageId(imageId);
    setSpId(spId);
  };

  const handleDeleteImage = () => {
    setDeletion(true);
    axiosInstance
      .delete(
        `/v1/building_profile/${encodeURIComponent(spId)}/remove_image?profile_image_id=${imageId}`
      )
      .then((res) => {
        if (res.status === 200) {
          const updatedImages = profileImages.imageList.filter((image) => image.id !== imageId);
          setProfileImages(updatedImages);
          setDeleteModal(false);
          setDeletion(false);
        }
      })
      .catch((error) => console.error('Error handleDeleteImage', error));
  };

  return (
    <div className='header-building-image-container'>
      {profileImages.imageList.length > 0 ? (
        <div className='building-image-container'>
          <AliceCarousel
            mouseTrackingEnabled
            responsive={responsive}
            dotsDisabled
            infinite={false}
            startIndex={startingIndex}
          >
            {profileImages.imageList.map((image) => (
              <div key={image.name}>
                <img
                  className='building-image'
                  src={image.image_url}
                  alt={image.name}
                  onClick={(e) => openImageModal(e, image)}
                />
                {!image.is_main_image && (
                  <a
                    role='presentation'
                    onClick={(e) => {
                      if (e) {
                        e.preventDefault();
                      }
                      makeMainImage(image.id, buildingProfile.site_plan_id);
                    }}
                    className='make_main-image'
                  >
                    Make Main Image
                  </a>
                )}
                {canRemoveImage && (
                  <a
                    className='icon icon-bin-white delete-building-image'
                    onClick={(e) => {
                      e.preventDefault();
                      removeImageHandler(image.id, buildingProfile.site_plan_id);
                    }}
                  />
                )}
              </div>
            ))}
          </AliceCarousel>

          {canAddImage && (
            <div
              role='presentation'
              className='icon icon-add-white upload-building-image'
              onClick={openUploadModal}
            />
          )}
        </div>
      ) : (
        <div className='header-building-image'>
          {profileImages.fetchCompleted && (
            <BuildingPhotoUpload openUploadModal={openUploadModal} canAddImage={canAddImage} />
          )}
        </div>
      )}

      {showDeleteModal ? (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          handleDelete={handleDeleteImage}
          deletion={deletion}
        />
      ) : null}

      <BuildingPhotoFooter
        buildingProfile={buildingProfile}
        user={user}
        setBuildingProfile={setBuildingProfile}
        buildingProfileHistories={buildingProfileHistories}
        updateBuildingProfileHistories={updateBuildingProfileHistories}
        showRuleModal={showRuleModal}
      />
    </div>
  );
};
