import React from 'react';
import ModalContainer from './ModalContainer';

const StrataMasterApiWizard = ({ wizardUrl }) => {
  const wizardIframe = `<iframe src=${wizardUrl} width="100%" height="100%" style="position: absolute; top: 0; left: 0"/>`;

  return (
    <ModalContainer dismissible={false}>
      <div
        className='modal__body'
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          padding: 0,
          margin: 0,
          minWidth: '700px',
          minHeight: '750px'
        }}
        dangerouslySetInnerHTML={{ __html: wizardIframe }}
      />
    </ModalContainer>
  );
};

export default StrataMasterApiWizard;
