import React, { useEffect, useRef, useState } from 'react';
import { Link } from '../index';

import './DocumentRowCollapse.module.scss';

const DocumentRowCollapse = ({ notes, tags, expandedRows, windowWidth }) => {
  const [isNoteTruncated, isNoteTrunctated] = useState(true);
  const [canTruncateNote, setCanTruncateNote] = useState(false);

  const noteElement = useRef();

  useEffect(() => {
    calculateCanTruncate();
  }, [noteElement, windowWidth]);

  const calculateCanTruncate = () => {
    if (noteElement.current) {
      setCanTruncateNote(noteElement.current.offsetHeight < noteElement.current.scrollHeight);
    }
  };

  return (
    <div className='document-collapse-row'>
      <div className='row-item-first-empty-col' />
      <div className={`accordion-item ${expandedRows ? '' : 'collapsed'}`}>
        <hr />

        {tags && (
          <div className='row tag-row'>
            <span className='row-item-first-col'>Tags: </span>
            <div className='row-item-second-col '>
              {tags.map((tag) => (
                <span key={tag.id} className='tag off-white'>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {notes && (
          <div className='row'>
            <span className='row-item-first-col'>Notes: </span>
            <div className='row-item-second-col note-wrapper'>
              <span ref={noteElement} className={isNoteTruncated ? `note note-truncated` : 'note'}>
                {notes}
                {!isNoteTruncated && canTruncateNote && (
                  <Link
                    classNameProp='show-less-link'
                    onClick={() => isNoteTrunctated(true)}
                    role='button'
                  >
                    Show less
                  </Link>
                )}
              </span>

              {isNoteTruncated && canTruncateNote && (
                <span className='show-more-link'>
                  {isNoteTruncated ? '... ' : null}
                  <Link onClick={() => isNoteTrunctated(false)} role='button'>
                    Show more
                  </Link>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentRowCollapse;
