import React from 'react';
// import './FileType.module.scss';

export const FileType = ({ type = 'doc', size = 'medium' }) => {
  const fileColour = {
    doc: 'blue',
    pdf: 'red',
    xls: 'green',
    zip: 'yellow'
  };

  const fileColourClassName = fileColour[type] ? `file-${fileColour[type]}` : 'file-blue';

  return <div className={`file-type-icon ${fileColourClassName} ${size}`}>{type}</div>;
};
