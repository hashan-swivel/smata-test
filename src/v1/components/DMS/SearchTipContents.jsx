import React, { useState, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import './SearchTipContents.module.scss';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ModalContainer from '../Modals/ModalContainer';
import { getCategories } from '../../../actions/categories';
import { getOrganisationTags } from '../../../actions/tags';

const SearchTipContents = ({ dispatch }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);
  const tagsLibrary = useSelector((state) => state.tags.tagsLibrary);
  const tagsLibraryLoading = useSelector((state) => state.tags.loading);

  useEffect(() => {
    if (!categories.length && categoriesLoading) dispatch(getCategories());
  }, [categories]);

  useEffect(() => {
    if (!tagsLibrary.length && tagsLibraryLoading) dispatch(getOrganisationTags());
  }, [tagsLibrary]);

  return (
    <ModalContainer>
      <div className='search-tip-modal-container'>
        <Tabs selectedIndex={activeTabIndex} onSelect={(tabIndex) => setActiveTabIndex(tabIndex)}>
          <TabList>
            <Tab>Search Tips</Tab>
            <Tab>Categories</Tab>
            <Tab>Tags</Tab>
          </TabList>

          <TabPanel>
            <div className='c-modal__body'>
              <div className='search-tip-contents'>
                <p className='bold'>1. Adding tags will filter your search</p>
                <p>The tags that can be used are;</p>
                <ul>
                  <li>Plan Number</li>
                  <li>Type</li>
                  <li>Lot</li>
                  <li>Contractor</li>
                  <li>Status</li>
                </ul>
                <p className='bold mb-0'>
                  2. To narrow search to specific terms you can use prefixes before your keywords
                </p>
                <p className='bold'>i.e prefix: keyword</p>
                <p className='mb-0'>An example is;</p>
                <p>contractor: Bells Locksmiths</p>
                <p className='italic'>Available prefixes are;</p>
                <ul>
                  <li>filename:</li>
                  <li>Plan Number:</li>
                  <li>type:</li>
                  <li>invoice_number:</li>
                  <li>tags:</li>
                  <li>contractor:</li>
                  <li>status:</li>
                  <li>lot_number:</li>
                </ul>
                <p>*Prefixes must be lower case</p>
                <p className='bold mb-0'>
                  3. To join search terms add the word ‘WITH’ between your keywords
                </p>
                <p className='bold'>i.e keyword WITH keyword</p>
                <p className='mb-0'>An example is:</p>
                <p>Quote WITH Roof</p>
                <p>*WITH must be in capitals</p>
                <p className='bold'>
                  For more information about search visit the{' '}
                  <a href='https://help.smata.com/' target='_blank' rel='noopener noreferrer'>
                    help.smata.com
                  </a>
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='c-modal__body'>
              <div className='search-tip-contents'>
                <p className='bold'>
                  The following is a list of categories that are used for document filling and
                  searchable:
                </p>
                <ul>
                  {categories?.length > 0 ? (
                    categories.map((category) => <li key={category.value}>{category.label}</li>)
                  ) : (
                    <span>No categories available</span>
                  )}
                </ul>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='c-modal__body'>
              <div className='search-tip-contents'>
                <p className='bold'>
                  The following is a list of tags that are used for document filling and searchable:
                </p>
                <ul>
                  {tagsLibrary?.length > 0 ? (
                    tagsLibrary.map((tag) => <li key={tag.id}>{tag.name}</li>)
                  ) : (
                    <span>No tags available</span>
                  )}
                </ul>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(SearchTipContents);
