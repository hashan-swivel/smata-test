import React from 'react';
import ReactTooltip from 'react-tooltip';
import RecurringRuleItem from '../../BuildingProfile/BuildingRules/RecurringRuleTabPanel/RecurringRuleItem';

import './RecurringRuleTooltip.module.scss';

const RecurringRuleTooltip = ({ rules = [] }) => {
  if (rules.length > 0) {
    return (
      <>
        <div className='alert alert--warning' data-tip data-for='global'>
          <strong>WARNING:</strong>
          &nbsp;
          <span style={{ color: '#4A90E2', textDecoration: 'underline' }}>
            Recurring rules found.
          </span>
          &nbsp;Use Override and Approve button below!
        </div>
        <ReactTooltip
          id='global'
          aria-haspopup='true'
          place='bottom'
          effect='float'
          type='light'
          border
          borderColor='#DFDFDF'
          backgroundColor='#F8F8F8'
          className='recurring-rule-tooltip'
        >
          {rules.map((rule) => (
            <RecurringRuleItem rule={rule} key={rule.id} canEdit={false} />
          ))}
        </ReactTooltip>
      </>
    );
  }

  return null;
};

export default RecurringRuleTooltip;
