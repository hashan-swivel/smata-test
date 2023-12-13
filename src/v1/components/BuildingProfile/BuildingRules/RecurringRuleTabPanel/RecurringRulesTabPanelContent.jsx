import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RecurringRuleList from './RecurringRuleList';
import RecurringRuleForm from './RecurringRuleForm';

import './RecurringRulesTabPanelContent.module.scss';

const RecurringRulesTabPanelContent = ({ spNumber, viewOnly }) => {
  const [view, setView] = useState('index');
  const [editingRule, setEditingRule] = useState({});
  const currentUser = useSelector((state) => state.auth.currentUser);

  const updateView = (event, val) => {
    setView(val);
  };

  const handleEditRuleClick = (rule) => {
    setEditingRule(rule);
    setView('edit');
  };

  const canEdit = currentUser?.isTenantManager && !viewOnly;

  switch (view) {
    case 'new':
      return (
        canEdit && (
          <RecurringRuleForm
            updateView={updateView}
            spNumber={spNumber}
            currentUser={currentUser}
          />
        )
      );
    case 'edit':
      return (
        canEdit && (
          <RecurringRuleForm
            updateView={updateView}
            spNumber={spNumber}
            currentRule={editingRule}
            currentUser={currentUser}
          />
        )
      );
    default:
      return (
        <RecurringRuleList
          updateView={updateView}
          spNumber={spNumber}
          handleEditRuleClick={handleEditRuleClick}
          viewOnly={viewOnly}
          currentUser={currentUser}
        />
      ); // 'index'
  }
};

export default RecurringRulesTabPanelContent;
