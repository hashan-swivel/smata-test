import React from 'react';
import moment from 'moment';
import Accordion from '../InvoiceView/Accordion';
import './History.module.scss';

export const History = ({ editing, history }) => {
  if (editing || !history) return null;

  return (
    <React.Fragment>
      <Accordion title='Document history:' initOpen={false}>
        <div className='document-view-block-content'>
          <ul className='document-history-list'>
            {history.map((item, index) => (
              <li key={`${index.toString()}-${item.created_at}`} className='document-history-item'>
                <span className='document-history-item-date'>
                  <strong>{moment(item.created_at, 'X').format('DD MMM YY - LTS')}</strong>
                </span>
                <span className='document-history-item-message'>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Accordion>
    </React.Fragment>
  );
};
