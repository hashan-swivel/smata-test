import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { Modal } from '../../Modal';
import { EditFile } from '../FileUpload/EditFile';
import { humanize } from '../../../../utils';

import './FilePreviewFooter.module.scss';

const dropdownTranslation = {
  file_url: 'download_original',
  pdf_url: 'download_pdf',
  other_documents_url: 'download_email_attachments',
  original_file_url: 'download_original_imported_document'
};

export const FilePreviewFooter = (props) => {
  const { doc, jobId, viewOnly } = props;

  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const canChangeDocument =
    (currentUser?.isSystemManager || currentUser?.isTenantManager) && !viewOnly && !jobId;
  const links = doc?.links || {};
  const downloadDropdownOptions = Object.entries(links).reduce((r, [k, v]) => {
    const translation = dropdownTranslation[k];
    if (v && translation) {
      r.push({ label: humanize(translation), value: translation, href: v });
    }
    return r;
  }, []);

  const openModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(true);
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
  };

  const downloadButton = () => {
    if (downloadDropdownOptions.length > 1) {
      return (
        <Select
          menuPlacement='top'
          options={downloadDropdownOptions}
          value={{ label: 'DOWNLOAD', value: '' }}
          classNamePrefix='react-select'
          components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
          styles={{
            menu: (base) => ({ ...base, right: 0, width: 'max-content', minWidth: '100%' }),
            control: (base) => ({
              ...base,
              minWidth: '120px',
              background: '#4FCBB2 !important',
              borderColor: '#4FCBB2 !important',
              color: '#FFFFFF !important',
              cursor: 'pointer',
              '&:hover': {
                background: '#2f9f88 !important',
                borderColor: '#2f9f88 !important'
              }
            }),
            singleValue: (base) => ({ ...base, color: '#FFFFFF !important', fontWeight: 'bold' }),
            placeholder: (base) => ({ ...base, fontWeight: 'bold', color: '#FFFFFF !important' })
          }}
          onChange={(selectedOption) => {
            const found = downloadDropdownOptions.find((o) => o.value === selectedOption.value);
            window.open(found.href, '_blank');
          }}
        />
      );
    }

    return (
      <a
        href={links.file_url}
        target='_blank'
        rel='noopener noreferrer'
        className='button button--primary'
        download
      >
        Download
      </a>
    );
  };

  return (
    <div className='dms-prev-pagination'>
      <div className='dms-prev-container'>
        <div className='dms-prev-container--button-container'>
          {canChangeDocument && (
            <button type='button' className='button button--primary' onClick={openModal}>
              Change
            </button>
          )}
          {downloadButton()}
        </div>
        {showModal ? (
          <Modal
            active={showModal}
            closeModal={closeModal}
            className='dropzone-modal'
            type='uploader'
          >
            <EditFile closeModal={closeModal} doc={doc} />
          </Modal>
        ) : null}
      </div>
    </div>
  );
};
