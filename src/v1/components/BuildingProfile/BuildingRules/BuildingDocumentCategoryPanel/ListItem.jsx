import React from 'react';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './BuildingDocumentCategoryPannel.module.scss';

export const ListItem = ({ item, handleEditClick, handleDeleteClick, canEdit }) => (
  <div className='building-document-category-card'>
    {canEdit && (
      <div className='action-buttons'>
        <button
          type='button'
          className='button button--link-dark'
          onClick={() => handleEditClick(item)}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
        <button
          type='button'
          className='button button--link-dark'
          onClick={() => handleDeleteClick(item.id)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    )}
    <p>
      <span className='badge badge--primary' style={{ fontSize: '100%' }}>
        {item.category?.label}
      </span>
    </p>
    <hr />
    <strong>Description:</strong>
    <p>{item.description}</p>

    <strong>Share With:</strong>
    <div className='shared-with-badges'>
      {item.building_document_permissions.map((p) => (
        <span className='badge badge--secondary' style={{ fontSize: '100%', marginRight: '.5rem' }}>
          {p.label}
        </span>
      ))}
    </div>
  </div>
);
