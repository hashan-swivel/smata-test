import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReportFormTabPanelContent from './ReportFormTabPanelContent';
import ReportListTabPanelContent from './ReportListTabPanelContent';
import ModalContainer from '../../Modals/ModalContainer';

import './FinancialReportsModal.module.scss';

const FinancialReportsModal = ({ defaultTabIndex, buildingId }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);

  return (
    <ModalContainer title='Financial Reports'>
      <div className='c-modal__body'>
        <Tabs selectedIndex={activeTabIndex} onSelect={(tabIndex) => setActiveTabIndex(tabIndex)}>
          <TabList>
            <Tab>Generate Report</Tab>
            <Tab>Report List</Tab>
          </TabList>

          <TabPanel>
            <ReportFormTabPanelContent
              buildingId={buildingId}
              setActiveTabIndex={() => setActiveTabIndex(1)}
            />
          </TabPanel>
          <TabPanel>
            <ReportListTabPanelContent />
          </TabPanel>
        </Tabs>
      </div>
    </ModalContainer>
  );
};

FinancialReportsModal.defaultProps = {
  defaultTabIndex: 0
};

export default FinancialReportsModal;
