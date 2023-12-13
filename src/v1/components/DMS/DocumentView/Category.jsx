import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fields } from '../../Form';
import { getCategories } from '../../../../actions/categories';

const fields = (categories) => [
  {
    name: 'category',
    label: 'Select a category for this document',
    component: 'react-select',
    options: categories.map((c) => (c.value === 'invoice' ? { ...c, disabled: true } : { ...c }))
  }
];

export const Category = (props) => (
  <div className='document-view-block'>
    <h3 className='document-view-block-title'>Document type:</h3>
    <div className='document-view-block-content'>
      <CategoryBody {...props} />
    </div>
  </div>
);

const CategoryBody = ({ editing, values, syncErrors, submitFailed }) => {
  const dispatch = useDispatch();
  const { category } = values;
  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);

  useEffect(() => {
    if (!categories.length && categoriesLoading) dispatch(getCategories());
  }, [categories]);

  if (editing) {
    return (
      <Fields
        fields={fields(categories)}
        values={values}
        syncErrors={syncErrors}
        submitFailed={submitFailed}
      />
    );
  }
  if (category) {
    return (
      <div className='tags'>
        <span key={category.value} className='tag off-white'>
          {category.value}
        </span>
      </div>
    );
  }
  return null;
};
