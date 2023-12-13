export const modalConstants = {
  SHOW: 'SHOW_MODAL',
  HIDE: 'HIDE_MODAL',
  STYLES: {
    content: {
      position: 'absolute',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: 0,
      transform: 'translate(-50%, -50%)',
      maxHeight: '90vh'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1
    }
  }
};
