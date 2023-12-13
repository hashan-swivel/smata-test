import React from 'react';

import './RowItemCollapse.module.scss';

const RowItemsCollapse = ({ invoice, expandedRows }) => (
  <div className='invoice-row-items-row'>
    <div className='row-item-first-empty-col' />
    <div className={`accordion-item ${expandedRows ? '' : 'collapsed'}`}>
      <hr />

      <div className='row-item__header'>
        <span className='row-item-first-col'>Row Items</span>
        <span className='row-item-second-col'>Description</span>
        <span className='row-item-third-col'>GL code</span>
        <span className='row-item-fourth-col'>Group Code</span>
        <span className='row-item-fifth-col'>Amount</span>
        <span className='row-item-sixth-col'>GST</span>
      </div>

      {invoice?.invoice_line_items?.map((line_item, index) => (
        <div className='row-item__row' key={`row-item-${line_item.id}`}>
          <span className='row-item-first-col'>{index + 1}</span>
          <span className='row-item-second-col'>{line_item.description || 'N/A'}</span>
          <span className='row-item-third-col'>
            {[line_item.gl_code_prefix, line_item.gl_code].filter((x) => !!x).join(' - ') || 'N/A'}
          </span>
          <span className='row-item-fourth-col'>{line_item.group_code || 'N/A'}</span>
          <span className='row-item-fifth-col'>{line_item.amount || 'N/A'}</span>
          <span className='row-item-sixth-col'>{line_item.gst || 'N/A'}</span>
        </div>
      ))}
    </div>
  </div>
);

export default RowItemsCollapse;
