import React from 'react';
import { DocumentSidebar, MessageSidebar } from './index';
import './RightSidebar.module.scss';

export const RightSidebar = ({
  documentData,
  showMobileMessage,
  showDocumentPreview,
  docUrl,
  showArchived,
  showEditMessageModal,
  handlePrint
}) =>
  Object.keys(documentData).length !== 0 && (
    <div className={`right-sidebar-container ${showDocumentPreview ? 'active' : 'inactive'}`}>
      <button
        type='button'
        className={`icon icon-chevron-down-dark back-button ${
          showDocumentPreview ? 'active' : 'inactive'
        }`}
        onClick={showMobileMessage}
      >
        Back
      </button>
      {documentData.attachments?.length && documentData.attachments[0]?.id ? (
        <DocumentSidebar
          documentData={documentData}
          docUrl={docUrl}
          showArchived={showArchived}
          showEditMessageModal={showEditMessageModal}
          handlePrint={handlePrint}
        />
      ) : (
        <MessageSidebar
          documentData={documentData}
          showEditMessageModal={showEditMessageModal}
          handlePrint={handlePrint}
        />
      )}
    </div>
  );
