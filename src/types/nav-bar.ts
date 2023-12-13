import React from 'react';

export type MenuListItem = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};
