import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from './List';

import './BuildingDocumentCategoryPannel.module.scss';

import FormItem from './FormItem';

const BuildingDocumentCategoryTabPanelContent = ({ accountId, viewOnly }) => {
  const dispatch = useDispatch();
  const [view, setView] = useState('index');
  const [editingRule, setEditingRule] = useState({});
  const currentUser = useSelector((state) => state.auth.currentUser);
  const canEdit = !currentUser.isStrataMember && !viewOnly;

  const updateView = (val) => {
    setView(val);
  };

  const handleEditClick = (rule) => {
    setEditingRule({ ...rule });
    setView('edit');
  };

  switch (view) {
    case 'new':
      return (
        canEdit && (
          <FormItem updateView={updateView} accountId={accountId} item={{}} dispatch={dispatch} />
        )
      );
    case 'edit':
      return (
        canEdit && (
          <FormItem
            updateView={updateView}
            accountId={accountId}
            item={editingRule}
            dispatch={dispatch}
          />
        )
      );
    default:
      return (
        <List
          updateView={updateView}
          accountId={accountId}
          handleEditClick={handleEditClick}
          canEdit={canEdit}
        />
      ); // 'index'
  }
};

export default BuildingDocumentCategoryTabPanelContent;
