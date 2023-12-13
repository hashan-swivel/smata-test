import React from 'react';
import { Fields } from '../../Form';

export const Tags = (props) => (
  <div className='document-view-block'>
    <h3 className='document-view-block-title'>Document tags:</h3>
    <div className='document-view-block-content'>
      <TagsBody {...props} />
    </div>
  </div>
);

const TagsBody = ({
  canCreate = false,
  editing,
  values,
  tagsLibrary,
  syncErrors,
  submitFailed
}) => {
  const { tags } = values;

  const fields = [
    {
      name: 'tags',
      label: `Select one or more tags for this document${
        canCreate ? ' (or hit enter to add)' : ''
      }`,
      component: 'react-select',
      isMulti: true,
      options: tagsLibrary,
      canCreateOptions: canCreate
    }
  ];

  if (editing) {
    return (
      <Fields fields={fields} values={values} syncErrors={syncErrors} submitFailed={submitFailed} />
    );
  }

  if (tags) {
    return (
      <div className='tags'>
        {tags.map((tag) => (
          <span key={tag.label} className='tag off-white'>
            {tag.value}
          </span>
        ))}
      </div>
    );
  }

  return null;
};
