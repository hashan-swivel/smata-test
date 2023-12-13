export const warningSwal = (props) => ({
  title: 'Are you sure?',
  text: 'Wish to perform this action?',
  confirmButtonText: 'YES',
  showCancelButton: true,
  customClass: {
    title: 'swal2-title text--center',
    htmlContainer: 'swal2-html-container text--center',
    confirmButton: 'button button--danger',
    cancelButton: 'button button--secondary'
  },
  ...props
});

export const loadingSwal = (props) => ({
  title: 'Loading...',
  allowEscapeKey: false,
  allowOutsideClick: false,
  ...props
});
