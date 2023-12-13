import { Button, Collapse } from '@mui/material';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

export type CollapsableFilterGroupProps = {
  children: ReactNode;
  maxVisibleItems?: number;
  expanded?: boolean;
};

export const CollapsableFilterGroup: React.FC<CollapsableFilterGroupProps> = ({
  children,
  expanded,
  maxVisibleItems = 3 // Set a default value or adjust as needed
}) => {
  const [collapsedSize, setCollapsedSize] = useState<number>();
  const [isExpanded, setExpanded] = useState(false);

  const collapseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collapseRef.current) {
      const childElement = collapseRef.current.firstElementChild as HTMLElement;
      if (childElement) {
        setCollapsedSize(childElement.offsetHeight);
      }
    }
  }, [children]);

  useEffect(() => {
    if (expanded) {
      setExpanded(expanded);
    }
  }, [expanded]);

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const renderChildren = () => {
    if (!isExpanded) {
      return React.Children.toArray(children).slice(0, maxVisibleItems);
    }
    return children;
  };

  return (
    <>
      <Collapse
        collapsedSize={collapsedSize}
        ref={collapseRef}
        in={isExpanded}
        sx={{
          '.MuiCollapse-wrapperInner': {
            width: 240
          }
        }}
      >
        {renderChildren()}
      </Collapse>
      {React.Children.count(children) > maxVisibleItems && (
        <Button
          variant='text'
          onClick={handleToggleExpand}
          size='small'
          fullWidth
          sx={{ justifyContent: 'start', paddingLeft: 2 }}
        >
          {isExpanded ? 'View Less' : 'View More'}
        </Button>
      )}
    </>
  );
};
