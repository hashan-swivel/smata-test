import { useDropzone } from 'react-dropzone';
import { documentConstants } from '../../../constants';

import './Dropzone.module.scss';

export default function Dropzone(props) {
  const { handleDropAccepted, options } = props;
  const { fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    ...documentConstants.DROPZONE_DEFAULT_CONFIGURATIONS,
    ...options,
    onDropAccepted: handleDropAccepted
  });

  function DropzoneErrors() {
    if (fileRejectionItems.length !== 0) {
      return (
        <aside className='dropzone__errors'>
          <ol>{fileRejectionItems}</ol>
        </aside>
      );
    }

    return null;
  }

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path}
      <ul>
        {errors.map((e) => {
          let msg = e.message;
          if (e.code === 'file-invalid-type') msg = 'File extension is not accepted';
          if (e.code === 'file-too-large') msg = 'File is too large (maximum is 30MB)';
          return <li key={e.code}>{msg}</li>;
        })}
      </ul>
    </li>
  ));

  return (
    <section className='dropzone_section'>
      <div {...getRootProps({ className: 'dropzone__container' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop here</p>
        ) : (
          <p className='p'>
            Drag and Drop or <a>Browse</a> to upload
          </p>
        )}
      </div>
      <DropzoneErrors />
    </section>
  );
}
