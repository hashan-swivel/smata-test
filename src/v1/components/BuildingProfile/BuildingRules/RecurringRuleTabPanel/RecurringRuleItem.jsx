import React from 'react';
import { currencyFormat } from '@/utils';

const RecurringRuleItem = (props) => {
  const { rule, handleEditRuleClick, handleDeleteRuleClick, canEdit } = props;

  return (
    <div className='recurring-rule-card'>
      {canEdit && (
        <div className='recurring-rule-actions'>
          <button
            type='button'
            className='edit-rule-btn icon icon-pencil'
            onClick={() => handleEditRuleClick(rule)}
          />
          <button
            type='button'
            className='delete-rule-btn icon icon-cross-dark'
            onClick={() => handleDeleteRuleClick(rule.id)}
          />
        </div>
      )}

      {rule.recurringable_type === 'Contractor' && (
        <p>
          <span className='badge badge--warning' style={{ fontSize: '100%' }}>
            Contractor
          </span>
          <span>&nbsp;{rule.recurringable?.display_name}</span>
          {rule.recurringable?.abn && <span>&nbsp;({rule.recurringable?.abn})</span>}
        </p>
      )}

      {rule.recurringable_type === 'GlCode' && (
        <p>
          <span className='badge badge--primary' style={{ fontSize: '100%' }}>
            GL Code
          </span>
          <span>&nbsp;{rule.recurringable?.display_name}</span>
        </p>
      )}

      <hr />

      <strong>Description:</strong>
      <p>{rule.description}</p>
      <div className='recurring-rule-range'>
        <div style={{ width: '50%' }}>
          <strong>Minimum: &nbsp;</strong>
          <span>{currencyFormat(rule.minimum)}</span>
        </div>

        <div style={{ width: '50%' }}>
          <strong>Maximum: &nbsp;</strong>
          <span>{currencyFormat(rule.maximum)}</span>
        </div>
      </div>
    </div>
  );
};

export default RecurringRuleItem;
