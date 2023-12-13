import { useDispatch } from 'react-redux';
import { OtherEmbeddedView } from '../../Document/OtherEmbeddedView';
import { PdfEmbeddedView } from '../../Document/PdfEmbeddedView';
import { modalActions } from '../../../../actions';

import './FilePreview.module.scss';

export const FilePreview = ({ url, type, doc }) => {
  const dispatch = useDispatch();

  const handleExpandClicked = () => {
    dispatch(
      modalActions.showModal('DOCUMENT_PREVIEW', {
        fileUrl: url,
        filename: doc?.display_name,
        fileExtension: doc?.file_extension,
        fileSize: doc?.file_size,
        addedDate: doc?.added_at || doc?.created_at
      })
    );
  };

  if (type === 'pdf') {
    return <PdfEmbeddedView url={url} handleExpandClicked={handleExpandClicked} />;
  }

  return <OtherEmbeddedView type={type} file={url} handleExpandClicked={handleExpandClicked} />;
};
