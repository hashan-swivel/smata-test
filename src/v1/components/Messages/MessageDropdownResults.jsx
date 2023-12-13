import React from 'react';
import { DisplayResult } from '../DMS/DisplayResult';

const results = {
  building: [
    {
      plan: 'PS724931',
      lot: '1234',
      address: '99 Test Street, North Sydney, 2060, NSW',
      value: 'PS724931',
      label: '99 Test Street, North Sydney, 2060, NSW'
    },
    {
      plan: 'PJDF83H7',
      lot: '5678',
      address: '16 Tuipia Street, Botany, 2019, NSW',
      value: 'PJDF83H7',
      label: '16 Tuipia Street, Botany, 2019, NSW'
    }
  ],
  file: [
    {
      category: { label: 'Invoices', value: 'invoices' },
      fileType: 'pdf',
      id: '#FUH234JHB',
      lot: { label: '1234', value: '1234' },
      name: 'Test invoice document',
      type: 'invoice',
      url: 'https://cors-anywhere.herokuapp.com/https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
    }
  ],
  contacts: [
    {
      firstName: 'Joe',
      lastName: 'Bloggs',
      userName: 'joe-bloggs',
      value: 'joe-bloggs',
      label: 'Joe Bloggs'
    },
    {
      firstName: 'Jane',
      lastName: 'Madows',
      userName: 'jane-madows',
      value: 'jane-madows',
      label: 'Jane Madows'
    },
    {
      firstName: 'Mark',
      lastName: 'Redfern',
      userName: 'mark-redfern',
      value: 'mark-redfern',
      label: 'Mark Redfern'
    },
    {
      firstName: 'Tony',
      lastName: 'Hitchman',
      userName: 'tony-hitchman',
      value: 'tony-hitchman',
      label: 'Tony Hitchman'
    }
  ]
};

export const MessageDropdownResults = (props) => {
  const { title, addToRedux, setSearchVal } = props;
  return (
    <div className='content'>
      <DisplayResult
        setSearchVal={setSearchVal}
        title={title}
        data={results[title]}
        addToRedux={addToRedux}
      />
    </div>
  );
};
