import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getContacts, setModalType } from '@/actions/buildingProfile';
import { flashActions, modalActions } from '@/actions';

import { Layout, Loading } from '@/components/v1';
import {
  Noticeboard,
  WorkHistory,
  PopularDocuments,
  RecentWorkModal,
  UpcomingWork,
  NoticeboardModal,
  ProfileImageUpload,
  ImageModal,
  ContactDetailsModal
} from '@/components/v1/BuildingProfile';
import { ProfileHeader } from '@/components/v1/BuildingProfile/Header';
import { Modal } from '@/components/v1/Modal';
import { axiosInstance } from '@/utils';
import { GoogleMap } from '@/components/v1/BuildingProfile/GoogleMap';
import { jobConstants, buildingProfileConstants } from '@/constants';
import { MeetingSection } from '@/components/v1/BuildingProfile/MeetingSection';

import Error from './_error';

import './building-profile.module.scss';

const BuildingProfile = ({ queryID, jobId, financialModal, showRuleModal }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const modalType = useSelector((state) => state.buildingProfile.modalType);

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [windowWidth, setWindowWidth] = useState();
  const [isMobile, setMobileView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileUploadModal, setProfileUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [buildingProfile, setBuildingProfile] = useState();
  const [jobs, setJobs] = useState([]);
  const [buildingProfileImages, setBuildingProfileImages] = useState({
    imageList: [],
    fetchCompleted: false
  });
  const [backButton, setBackButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [buildingProfileHistories, setBuildingProfileHistories] = useState([]);
  const [errorCode, setErrorCode] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!queryID && currentUser.role === 'strata_member') {
      Router.push({
        pathname: '/building-profile',
        query: { id: currentUser.sp_number }
      });
    }

    if (financialModal) {
      dispatch(
        modalActions.showModal('FINANCIAL_REPORT', {
          defaultTabIndex: 0,
          buildingId: buildingProfile?.id
        })
      );
    }
  }, [currentUser]);

  useEffect(() => {
    setReload(false);
  }, [reload]);

  // TODO: is there a reason why this isn't being dispatched to redux?
  useEffect(() => {
    if (queryID) getBuildingProfile();
  }, [queryID]);

  const getBuildingProfile = async () => {
    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(queryID)}`)
      .then((res) => {
        setErrorCode(false);
        setBuildingProfile(res.data);
        setBuildingProfileHistories(res.data?.building_rules?.histories);
        getImages();
        getJobs({
          moreJob: true,
          page: currentPage,
          recent_job_status: 'completed'
        });
        dispatch(getContacts(queryID));
      })
      .catch((err) => setErrorCode(err?.response?.status));
  };

  const getImages = async () => {
    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(queryID)}/images`)
      .then((res) =>
        setBuildingProfileImages({
          imageList: res.data.images,
          fetchCompleted: true
        })
      )
      .catch((err) => dispatch(flashActions.showError(err)));
  };

  const updateBuildingProfileHistories = async () => {
    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(queryID)}`)
      .then((res) => setBuildingProfileHistories(res.data?.building_rules?.histories))
      .catch((err) => dispatch(flashActions.showError(err)));
  };

  const resetJobs = () => {
    if (jobs.length > 20) {
      jobs.length = 20;
    }
  };

  const getJobs = async ({ moreJob = true, page = 1, recent_job_status = '' }) => {
    setIsLoadingJobs(true);
    const params = `?pagination=true&per_page=20&page=${page}&recent_job_status=${
      recent_job_status || ''
    }`;

    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(queryID)}/jobs${params}`)
      .then((response) => {
        page === 1 ? setJobs(response.data.jobs) : setJobs(jobs.concat(response.data.jobs));
        setShowLoadMoreButton(page < response.data.meta.total_pages);
        moreJob ? setCurrentPage(page + 1) : setCurrentPage(1);
        setIsLoadingJobs(false);
      })
      .catch((error) => {
        setIsLoadingJobs(false);
        dispatch(flashActions.showError(error));
      });
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
    setCurrentPage(1);
    resetJobs();
    dispatch(setModalType({ name: '' }));
  };

  const openImageModal = (event, image) => {
    if (event) event.preventDefault();
    setShowImageModal(true);
    setModalImage(image);
  };

  const closeImageModal = (event) => {
    if (event) event.preventDefault();
    setShowImageModal(false);
    setModalImage(null);
  };

  const openUploadModal = (event) => {
    if (event) event.preventDefault();
    setProfileUploadModal(true);
  };

  const closeUploadModal = (event) => {
    if (event) event.preventDefault();
    setProfileUploadModal(false);
  };

  const setProfileImages = (imageList) => {
    setBuildingProfileImages({ imageList, fetchCompleted: true });
  };

  const filteredJobs = (_jobs) =>
    _jobs.filter((job) =>
      job.job_statuses.find(
        (status) => !jobConstants.UPCOMING_WORK_EXCLUDED_STATUSES.includes(status)
      )
    );

  // Sets the modal according to which 'View All' button is clicked
  const getModalComponent = () => {
    if (modalType.name === 'recent-work') {
      return (
        <RecentWorkModal
          getJobs={getJobs}
          isLoading={isLoadingJobs}
          jobs={jobs}
          showLoadMoreButton={showLoadMoreButton}
          currentPage={currentPage}
        />
      );
    }

    if (modalType.name === 'noticeboard') {
      return (
        <NoticeboardModal
          noticeboardItems={buildingProfile.noticeboards}
          displayType={modalType.displayType}
        />
      );
    }

    if (modalType && modalType.name === 'contact-details') {
      return (
        <ContactDetailsModal
          spNumber={buildingProfile.site_plan_id}
          locations={buildingProfile.locations}
          enableBackButton={modalType.enableBackButton}
        />
      );
    }

    return null;
  };

  // Add listener to detect change of window width
  useEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
      setLoading(false);
    }
    window.addEventListener('resize', updateSize);
    if (loading) {
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }
    return null;
  }, []);

  // Set mobile state to true when window width <= 660px
  useEffect(() => {
    if (windowWidth <= 660) {
      setMobileView(true);
    } else setMobileView(false);
  }, [windowWidth]);

  // Re-render when modal is opened and closed
  useEffect(() => {
    if (showModal === false) {
      setBackButton(false);
    }
  }, [showModal]);

  if (errorCode) {
    return (
      <Layout customSeo={buildingProfileConstants.SEO} isBuildingProfile>
        <Error statusCode={errorCode} />
      </Layout>
    );
  }

  if (!loading && buildingProfile) {
    return (
      <Layout
        customSeo={buildingProfileConstants.SEO}
        buildingProfile={buildingProfile}
        isBuildingProfile
      >
        <div>
          <Modal active={showImageModal} closeModal={closeImageModal} className='dropzone-modal'>
            <ImageModal
              openImageModal={openImageModal}
              closeImageModal={closeImageModal}
              image={modalImage}
            />
          </Modal>
          <Modal
            active={modalType.name || showModal}
            closeModal={closeModal}
            className={`${modalType}`}
          >
            {getModalComponent()}
          </Modal>
          <Modal
            active={profileUploadModal}
            closeModal={closeUploadModal}
            className='dropzone-modal'
          >
            <ProfileImageUpload
              buildingProfile={buildingProfile}
              openUploadModal={openUploadModal}
              closeUploadModal={closeUploadModal}
              profileImages={buildingProfileImages.imageList}
              setProfileImages={setProfileImages}
            />
          </Modal>
          <div className='building-profile-wrapper building-profile-wrapper_redesign'>
            <ProfileHeader
              user={currentUser}
              buildingProfile={buildingProfile}
              setReload={setReload}
              openUploadModal={openUploadModal}
              openImageModal={openImageModal}
              closeUploadModal={closeUploadModal}
              closeImageModal={closeImageModal}
              profileImages={buildingProfileImages}
              setProfileImages={setProfileImages}
              setBuildingProfile={setBuildingProfile}
              buildingProfileHistories={buildingProfileHistories}
              updateBuildingProfileHistories={updateBuildingProfileHistories}
              showRuleModal={showRuleModal}
              dispatch={dispatch}
            />
            <div className='grid-wrapper work-documents-container building-layout-wrapper'>
              {buildingProfile?.can_view_recent_works && (
                <div className='left-grid-work-history'>
                  <WorkHistory
                    location={buildingProfile.locations[0]}
                    recentJobs={buildingProfile.recent_work_history}
                  />
                </div>
              )}
              <div
                className={`right-grid-popular-documents building-layout-wrapper ${
                  buildingProfile?.can_view_recent_works ? '' : 'col-span-two'
                }`}
              >
                <PopularDocuments isMobile={isMobile} buildingProfile={buildingProfile} />
              </div>
            </div>
            {buildingProfile?.can_view_upcoming_works && (
              <div className='building-profile-component building-layout-wrapper'>
                <UpcomingWork
                  upcomingWorks={filteredJobs(buildingProfile.upcoming_work)}
                  jobId={jobId}
                  buildingProfile={buildingProfile}
                />
              </div>
            )}
            <div className='building-profile-component building-layout-wrapper'>
              <Noticeboard currentUser={currentUser} buildingProfile={buildingProfile} />
            </div>
            {currentUser?.feature_flags?.strata_master_meeting === true && (
              <MeetingSection account_id={buildingProfile?.id} />
            )}
            <div className='building-profile-component building-profile-map'>
              <GoogleMap lat_lng={buildingProfile?.locations[0].lat_lng} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return <Loading />;
};

BuildingProfile.getInitialProps = async ({ query, req }) => {
  const { id: queryID, jobId, financial_modal: financialModal, rule_modal: showRuleModal } = query;

  return { queryID, jobId, financialModal, showRuleModal };
};

export default BuildingProfile;
