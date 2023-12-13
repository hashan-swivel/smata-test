import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ModalContainer from './ModalContainer';
import InvoiceRulesTabPanelContent from '../BuildingProfile/BuildingRules/InvoiceRulesTabPanelContent';
import RecurringRulesTabPanelContent from '../BuildingProfile/BuildingRules/RecurringRuleTabPanel/RecurringRulesTabPanelContent';
// import DocumentRulesTabPanelContent from '../BuildingProfile/BuildingRules/DocumentRuleTabPanel/DocumentRulesTabPanelContent';

import './BuildingRules.module.scss';

const BuildingRules = (props) => {
  const { buildingProfile, viewOnly } = props;
  const spNumber = buildingProfile.site_plan_id;
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <ModalContainer title='Building Rules'>
      <div className='c-modal__body'>
        <Tabs selectedIndex={activeTabIndex} onSelect={(tabIndex) => setActiveTabIndex(tabIndex)}>
          <TabList>
            <Tab>Invoice</Tab>
            <Tab>Recurring</Tab>
            <Tab>Documents</Tab>
          </TabList>

          <TabPanel>{/*<InvoiceRulesTabPanelContent {...props} />*/}</TabPanel>
          <TabPanel>
            <RecurringRulesTabPanelContent spNumber={spNumber} viewOnly={viewOnly} />
          </TabPanel>
          <TabPanel>
            {/*<DocumentRulesTabPanelContent spNumber={spNumber} viewOnly={viewOnly} />*/}
          </TabPanel>
        </Tabs>
      </div>
      <div className='modal__footer' />
    </ModalContainer>
  );
};

BuildingRules.defaultProps = {
  viewOnly: false
};

export default BuildingRules;
