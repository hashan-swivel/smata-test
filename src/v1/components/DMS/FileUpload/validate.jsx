export const validate = (values) => {
  const errors = {};
  if (values.file && values.file.length) {
    values.file.forEach((item, index) => {
      if (!item.filename) {
        errors[`file[${index}].filename`] = 'Please enter a file name';
      } else if (!values.global.validSpNumber && (!item.spNumber || !item.validSpNumber)) {
        errors[`file[${index}].spNumber`] = 'Please enter a valid Plan Number';
      } else if (!values.global.docCategory && !item.docCategory) {
        errors[`file[${index}].docCategory`] = 'Please select a category';
      }
      if (item.addToNoticeboard) {
        if (!item.noticeboardTitle) {
          errors[`file[${index}].noticeboardTitle`] = 'Please enter a title for noticeboard';
        }
      }
    });
  }
  return errors;
};
