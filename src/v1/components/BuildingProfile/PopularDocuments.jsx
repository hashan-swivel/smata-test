import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Link } from '../Link';
import { FileType } from '../FileType';
import { Loading } from '../Loading';
import { flashActions, modalActions } from '../../../actions';
import { setFilters, setToggleActions } from '../../../actions/dms';
import { axiosInstance } from '../../../utils';

import './WorkHistory.module.scss';
import './PopularDocuments.module.scss';

const PopularDocuments = ({ isMobile, currentUser, buildingProfile, dispatch }) => {
  const [showMoreDocs, setShowMoreDocs] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const spNumber = buildingProfile?.site_plan_id?.toLowerCase();

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const viewAll = currentUser?.document_permissions?.['document.view_all'];
      const basePath = viewAll ? '/v1/documents/organisation_documents' : '/v1/documents';

      const params = {
        organisation_id: currentUser?.organisation_id,
        sp_number: buildingProfile?.site_plan_id?.toLowerCase(),
        scope: viewAll ? 'all' : null,
        popular: true
      };

      axiosInstance
        .get(basePath, { params })
        .then((res) => {
          setLoading(false);
          setDocuments(res.data.documents);
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
        });
    }, 500);
  }, []);

  useEffect(() => {
    checkMobile();
  }, [isMobile]);

  const fetchLevyNotices = async () => {
    dispatch(setToggleActions({ favorites: false, my_tasks: false, is_invoice: false }));
    dispatch(
      setFilters([
        { type: 'type', item: 'Levy Notice' },
        { type: 'sp_number', item: spNumber }
      ])
    );
    Router.push('/documents');
  };

  const checkMobile = () => {
    if (!isMobile) {
      setShowMoreDocs(true);
    } else {
      setShowMoreDocs(false);
    }
  };

  const documentList = () => {
    if (loading) return <Loading componentLoad />;

    if (!documents?.length)
      return <div className='popular-document-placeholder'>Nothing to display</div>;

    return (
      <div className='popular-documents-grid popular-documents-grid_redesign active'>
        {documents &&
          documents.map((doc) => (
            <Link
              href={doc.category === 'invoice' ? '/invoice' : '/document-preview'}
              query={{ id: doc.id }}
              key={doc.id}
              classNameProp='single-document-grid popular-doc-link a'
            >
              <FileType type={doc.file_extension} />
              <div className='document-name-tag'>
                <div className='document-name'>
                  <strong className='document-title'>{doc.display_name}</strong>
                </div>
                <div className='document-tag-border'>
                  <span className='document-tag-text'>{doc.category}</span>
                </div>
              </div>
              <div className='document-details'>
                <span>Uploaded by: {doc.owner_name || 'N/A'}</span>
                <span>{Moment.unix(doc.created_at).format('DD MMM YYYY')} </span>
              </div>
            </Link>
          ))}
        <div className={`${isMobile ? 'mobile' : 'not-mobile'}`}>
          <div
            role='presentation'
            onClick={checkMobile}
            className={`view-toggle icon-after icon-chevron-down-dark ${
              showMoreDocs ? 'active' : 'inactive'
            }`}
          >
            {!showMoreDocs ? (
              <strong className='view-more-less'>View More</strong>
            ) : (
              <strong className='view-more-less'>View Less</strong>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='building-popular-documents-container'>
      <div className='work-documents-header building-title-margin'>
        <div className='mobile-view-header'>
          <h3 className='building-title-heading h3'>Popular Documents</h3>
        </div>
        <div className='popular-buttons-container'>
          {currentUser && (
            <>
              {buildingProfile?.can_view_levy_notices && (
                <button type='button' className='button primary' onClick={() => fetchLevyNotices()}>
                  LEVY Notices
                </button>
              )}
              {buildingProfile?.can_generate_financial_report && (
                <button
                  type='button'
                  className='button primary'
                  onClick={() => dispatch(modalActions.showModal('FINANCIAL_REPORT', {}))}
                >
                  Financial Reports
                </button>
              )}
            </>
          )}
          <Link
            href='/v1/documents'
            classNameProp='button secondary'
            onClick={() => dispatch(setFilters([{ type: 'sp_number', item: spNumber }]))}
          >
            View All
          </Link>
        </div>
      </div>
      {documentList()}
    </div>
  );
};

export default connect((state) => state.auth)(PopularDocuments);
