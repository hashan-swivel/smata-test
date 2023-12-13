import { ReactElement, ReactNode } from 'react';

import { EmotionCache } from '@emotion/react';
import { NextPage } from 'next';
import { AppProps } from 'next/app';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
} & {
  emotionCache?: EmotionCache;
};

export type SubSection = {
  name: string;
  path: string;
  action?: () => void;
};

export type NavDrawerSubSections = Array<SubSection>;

export type DatatableViewOptions = 'list' | 'grid';

export type RowActionMenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color?: 'error' | 'default';
};
