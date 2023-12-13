import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.module.scss';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean']
  ]
};

/**
 * Note: The onChange method will not receive an event object as a parameter.
 * Instead it will receive the current value as the parameter. This needs to
 * be handled when using this component with third-party form libraries
 */
const RichTextEditor = (props) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return <ReactQuill theme='snow' modules={modules} {...props} />;
};

export default RichTextEditor;
