import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import { reduxForm, autofill, reset } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import {
  addLabelToTags,
  addLabelToCategory,
  userOptionObj,
  addLabelToLotNumber,
  axiosInstance
} from '@/utils';
import { getOrganisationTags } from '@/actions/tags';
import { getOrgSpNumbers } from '@/actions/spNumbers';
import { flashActions } from '@/actions';
import { documentConstants } from '@/constants';
import { Layout, Loading, Modal } from '@/components/v1';
import {
  Category,
  FilePreview,
  FilePreviewFooter,
  Footer,
  Header,
  History,
  Tags,
  Visibility,
  SharedWith
} from '@/components/v1/DMS/DocumentView';
import RulesModal from '@/components/v1/BuildingProfile/BuildingRules/RulesModal';
import Error from './_error';

import './document-preview.module.scss';

// Set form name
const formName = 'documentForm';

const DocumentPreview = ({ queryId, submitFailed }) => {
  const [data, setData] = useState();
  const [buildingData, setBuildingData] = useState();
  const [loading, setLoading] = useState(true);
  const [documentDetails, setDocumentDetails] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [keepDropdownOpen, setKeepDropdownOpen] = useState(false);
  // For building rule modals & its redux form state
  const [buildingRules, setBuildingRules] = useState();
  const [buildingRulesFormModalData, setBuildingRulesFormModalData] = useState({});
  const [buildingProfileHistories, setBuildingProfileHistories] = useState([]);
  const oneOffApprovers = buildingRules?.one_off_invoices?.approvers;
  const currentUser = useSelector((state) => state.auth.currentUser);
  const spList = useSelector((state) => state.spNumbers.orgSpNumbers);
  const spListLoading = useSelector((state) => state.spNumbers.loading);
  const [showBuildingRule, setShowBuildingRule] = useState(false);
  // Redux form state
  const formState = useSelector((state) => state.form[formName]);
  const { values, syncErrors } = formState;
  const tagsLibrary = useSelector((state) => state.tags.tagsLibrary);
  const tagsLibraryLoading = useSelector((state) => state.tags.loading);
  const isAdmin = currentUser.role === 'admin';
  const [selectedSharedUsersByRole, setSelectedSharedUsersByRole] = useState([]);
  const [errorCode, setErrorCode] = useState(false);

  useEffect(() => {
    getData();
  }, [queryId]);

  // Fetch data for document
  const getData = async () => {
    await axiosInstance
      .get(`/v1/documents/${queryId}`)
      .then((res) => {
        setErrorCode(false);
        setData(res.data);
      })
      .catch((err) => setErrorCode(err?.response?.status));
  };

  // Fetch users and SP numbers of organisation
  useEffect(() => {
    const { organisation_id: orgId } = currentUser;
    if (!spList.length && spListLoading && (orgId || isAdmin)) dispatch(getOrgSpNumbers(orgId));
  }, [currentUser]);

  // Fetch data for building relating to sp number
  useEffect(() => {
    if (data) setLoading(false);

    const getBuildingData = async () => {
      await axiosInstance
        .get(`/v1/building_profile/${encodeURIComponent(data.sp_number)}`)
        .then((res) => setBuildingData(res.data))
        .catch(console.error);
    };
    if (data?.sp_number) {
      getBuildingData();
    }
  }, [data]);

  useEffect(() => {
    if (buildingData) {
      setBuildingRules(buildingData.building_rules);
      setShowBuildingRule(true);
    }
  }, [buildingData]);

  const {
    history,
    id,
    category,
    tags,
    display_name: displayName,
    file_extension: fileType,
    links,
    additional_users: sharedWith,
    owner_id: ownerId,
    popular,
    job,
    contractor,
    sp_number: spNumber,
    account_share_with_users: accountShareWithUsers,
    deleted
  } = data || {};

  const jobId = job ? job.id : null;
  const { file_url: url } = links || {};
  const [editing, setEdititing] = useState(false);

  const sharedWithOwners =
    accountShareWithUsers?.owners?.length > 0 &&
    accountShareWithUsers?.owners?.every((i) => sharedWith?.map((x) => x.id).includes(i));

  const sharedWithCommitteeMembers =
    accountShareWithUsers?.committee_members?.length > 0 &&
    accountShareWithUsers?.committee_members?.every((i) =>
      sharedWith?.map((x) => x.id).includes(i)
    );

  // When page loaded from next button, will scroll to top
  const pageTop = useRef();
  const scrollToTop = () => {
    if (pageTop.current) {
      pageTop.current.scrollIntoView();
    }
  };

  // Map destructured data for local and redux state
  const mapDocumentDetails = () => {
    if (data) {
      setDocumentDetails({
        name: displayName,
        category: addLabelToCategory(category),
        url: links?.pdf_url || links?.file_url,
        fileType: links?.pdf_url ? documentConstants.PDF_EXTENSION : fileType,
        building: data.building,
        spNumber: spNumber,
        lot: addLabelToLotNumber(data.lot_number, data.lot_number_id),
        tags: addLabelToTags(tags),
        sharedWith: sharedWith.map(userOptionObj),
        history,
        popular
      });
    }
  };

  // Get access to dispatch
  const dispatch = useDispatch();

  const autofillDefaultValues = () => {
    const prepopulatedData = Object.entries(documentDetails);
    prepopulatedData.forEach((ppData) => {
      const [field, value] = ppData;
      dispatch(autofill(formName, field, value));
    });
  };

  const toggleEditMode = async (event, isSaving) => {
    if (event) event.preventDefault();

    const currentValues = values;

    if (!currentValues.sharedWith) {
      currentValues.sharedWith = [];
    }

    const changeDetected = JSON.stringify(documentDetails) !== JSON.stringify(currentValues);

    // Pressed save button and has pending changes
    if (isSaving && changeDetected) {
      const {
        category: reduxCategory,
        tags: reduxTags,
        sharedWith: reduxSharedWith,
        popular: addToPopular
      } = values;

      const sharedWithUsers = [
        ...new Set(reduxSharedWith.concat(selectedSharedUsersByRole).filter((u) => u.id))
      ];

      // Separate custom tags from existing tags
      const tags = reduxTags?.filter((tag) => !tag.__isNew__) ?? [];
      const customTags = reduxTags?.filter((tag) => tag.__isNew__) ?? [];

      // Make update request to API with query string
      const query = queryString.stringify({
        display_filename: values?.name,
        category: reduxCategory.value,
        popular: addToPopular,
        custom_tags: customTags.map((tag) => `${tag.value}`).join(', '),
        lot_number_id: values.lot.value || null,
        sp_number: values.spNumber
      });

      // Tags will be converted to query string for update
      const tagsQuery =
        tags.length > 0
          ? tags.map((tag) => `&tags_attributes[][name]=${tag.value}`).join('')
          : '&tags_attributes[][name]=';

      // Additional users will be converted to query string for update
      const additionalUsersQuery = sharedWithUsers
        .map((user) => `&additional_users_attributes[][id]=${user.id}`)
        .join('');

      await axiosInstance
        .put(`/v1/documents/${id}?${query}${tagsQuery}${additionalUsersQuery}`)
        .then((res) => {
          dispatch(flashActions.showSuccess('Document has been saved'));
          setData(res?.data);
          Router.reload();
          return setEdititing(!editing);
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
          return setEdititing(!editing);
        });
    }

    // Pressed cancel button and has pending changes
    if (editing && !isSaving && changeDetected) {
      const confirm = window.confirm('Are you sure, your changes will not be saved?');
      if (confirm) {
        dispatch(reset(formName));
        autofillDefaultValues();
        return setEdititing(!editing);
      }
      return null;
    }

    // Toggle without action no changes detected
    return setEdititing(!editing);
  };

  // When component mounts
  useEffect(() => {
    if (documentDetails) {
      // Autofill fields with default values
      autofillDefaultValues();
      // Reset form state on clean up
      return () => dispatch(reset(formName));
    }
  }, []);

  // Re-set local state when new document loaded from next button
  useEffect(() => {
    mapDocumentDetails();
    scrollToTop();
  }, [id]);

  // Get tags library for edit view
  useEffect(() => {
    if (editing && tagsLibrary.length === 0 && tagsLibraryLoading) {
      dispatch(getOrganisationTags(currentUser.organisation_id));
    }
  }, [currentUser.organisation_id, editing, tagsLibrary]);

  useEffect(() => {
    if (documentDetails) {
      autofillDefaultValues();
    }
  }, [documentDetails]);

  // Setting the building rules data values to be passed to the building rules modal
  useEffect(() => {
    const internalApprovers = oneOffApprovers?.filter((x) => x.approver_type === 'internal');
    const externalApprovers = oneOffApprovers?.filter((x) => x.approver_type === 'external');
    const firstApprover = oneOffApprovers?.filter((x) => x.first_approver === true);

    setBuildingRulesFormModalData({
      amountToApprove: buildingRules?.one_off_invoices?.external_approvers_needed,
      oneOffIntRequired: true,
      oneOffIntFirst: firstApprover?.length ? [userOptionObj(...firstApprover)] : null,
      oneOffIntAmount: `$${buildingRules?.one_off_invoices?.amount_is_over_internal}`,
      oneOffIntApproval: internalApprovers?.map(userOptionObj),
      oneOffExtRequired: externalApprovers?.length >= 1,
      oneOffExtAmount: `$${buildingRules?.one_off_invoices?.amount_is_over_external}`,
      oneOffExtApproval: externalApprovers?.map(userOptionObj)
    });

    setBuildingProfileHistories(buildingRules?.histories);
  }, [buildingRules]);

  const openModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(true);
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
  };

  const getModalComponent = () => {
    if (modalType === 'building-rules') {
      return (
        <RulesModal
          buildingProfile={buildingData}
          closeModal={closeModal}
          formData={buildingRulesFormModalData}
          setFormData={setBuildingRulesFormModalData}
          buildingProfileHistories={buildingProfileHistories}
          defaultTabIndex={2}
          viewOnly
        />
      );
    }
    return null;
  };

  const shareWithComponent = () => {
    if (!currentUser?.isTenantManager) return null;

    if (editing) {
      return (
        <SharedWith
          users={documentDetails.sharedWith}
          editing
          values={values}
          syncErrors={syncErrors}
          submitFailed={submitFailed}
          formName={formName}
          ownerId={ownerId}
          setSelectedSharedUsersByRole={setSelectedSharedUsersByRole}
          sharedWithOwners={sharedWithOwners}
          sharedWithCommitteeMembers={sharedWithCommitteeMembers}
        />
      );
    }

    return <Visibility data={data} />;
  };

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (!loading) {
    return (
      <div className='wrapper document-view-wrapper'>
        <div ref={pageTop} className='doc-scroll-ref' />
        <div className='document-view-left'>
          <Header
            {...documentDetails.building}
            lot={documentDetails.lot}
            name={documentDetails.name}
            fileType={documentDetails.fileType}
            editing={editing}
            toggleEditMode={toggleEditMode}
            values={values}
            syncErrors={syncErrors}
            submitFailed={submitFailed}
            buildingData={buildingData}
            ownerId={ownerId}
            id={id}
            currentUser={currentUser}
            job={job}
            contractor={contractor}
            spList={spList}
            formName={formName}
            openModal={openModal}
            setModalType={setModalType}
            keepDropdownOpen={keepDropdownOpen}
            setKeepDropdownOpen={setKeepDropdownOpen}
            showBuildingRule={showBuildingRule}
            deleted={deleted}
          />
          {shareWithComponent()}
          <Category
            editing={editing}
            values={values}
            syncErrors={syncErrors}
            submitFailed={submitFailed}
          />
          <Tags
            editing={editing}
            values={values}
            tagsLibrary={addLabelToTags(tagsLibrary)}
            syncErrors={syncErrors}
            submitFailed={submitFailed}
            canCreate={currentUser?.isOrganisationAdmin}
          />
          <History history={history} editing={editing} />
          <Footer
            editing={editing}
            toggleEditMode={toggleEditMode}
            id={id}
            buildingData={buildingData}
            spNumber={spNumber}
            filename={displayName}
            category={category}
            users={documentDetails.sharedWith}
            currentUser={currentUser}
          />
        </div>
        <div className='document-view-right'>
          <div className='document-right-container'>
            <FilePreview
              url={documentDetails.url}
              type={documentDetails.fileType}
              doc={data}
              jobId={jobId}
            />
            <FilePreviewFooter file={url} doc={data} jobId={jobId} />
          </div>
        </div>
        <Modal active={showModal} closeModal={closeModal} className={modalType}>
          {getModalComponent()}
        </Modal>
      </div>
    );
  }

  return <Loading />;
};

DocumentPreview.getInitialProps = async ({ query, store }) => {
  const { id: queryId } = query;

  return {
    queryId
  };
};

DocumentPreview.getLayout = (page) => (
  <Layout customSeo={documentConstants.SHOW_SEO} headerClassName='mw-100'>
    {page}
  </Layout>
);

// Wrap component in reduxForm HOC
export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  enableReinitialize: false,
  initialValues: {}
})(DocumentPreview);
