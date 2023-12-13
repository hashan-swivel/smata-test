import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import InvoiceRulesTabPanelContent from './InvoiceRulesTabPanelContent';
import RecurringRulesTabPanelContent from './RecurringRuleTabPanel/RecurringRulesTabPanelContent';
import BuildingDocumentCategoryTabPanelContent from './BuildingDocumentCategoryPanel/BuildingDocumentCategoryTabPanelContent';

import './RulesModal.module.scss';

const RulesModal = (props) => {
  const { buildingProfile, viewOnly, defaultTabIndex } = props;
  const spNumber = buildingProfile.site_plan_id;
  const accountId = buildingProfile.id;
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className='rules-modal-container'>
      <h3 className='rules-title h3'>Building Rules</h3>
      <Tabs selectedIndex={activeTabIndex} onSelect={(tabIndex) => setActiveTabIndex(tabIndex)}>
        <TabList>
          <Tab>Invoice</Tab>
          <Tab>Recurring</Tab>
          {(currentUser.isSystemManager || currentUser.isTenantManager) && <Tab>Documents</Tab>}
        </TabList>

        <TabPanel>
          <InvoiceRulesTabPanelContent {...props} isStrataMember={currentUser?.isStrataMember} />
        </TabPanel>
        <TabPanel>
          <RecurringRulesTabPanelContent spNumber={spNumber} viewOnly={viewOnly} />
        </TabPanel>
        {(currentUser.isSystemManager || currentUser.isTenantManager) && (
          <TabPanel>
            <BuildingDocumentCategoryTabPanelContent accountId={accountId} viewOnly={viewOnly} />
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
};

RulesModal.defaultProps = {
  viewOnly: false,
  defaultTabIndex: 0
};

export default RulesModal;
