import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Footer } from './Footer';
import { Header } from './Header';
import { userOptionObj } from '../../utils';
import { layoutConstants } from '../../constants';
import Flash from './Flash';
import ModalRoot from './Modals/ModalRoot';
import CompareAndConnectAlert from './CompareAndConnectAlert';
import BannersBar from './BannersBar';

import 'typeface-lato';
import '../../sass/global/styles.module.scss';
import './Layout.module.scss';

export const Layout = ({
  children,
  customSeo,
  bodyClassName,
  isBuildingProfile,
  isConnectionPage,
  buildingProfile,
  footerClassName,
  mainClassName,
  headerClassName,
  containerClassName,
  compareConnectAlert,
  hideBannersBar
}) => {
  const [mainContentClass, setMainContentClass] = useState('');
  const [footerClass, setFooterClass] = useState('');
  const [containerClass, setContainerClass] = useState('');
  const seo = { ...layoutConstants.SEO, ...customSeo };

  const userState = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    setMainContentClass(classNames(`main-content`, mainClassName));
  }, [mainClassName]);

  useEffect(() => {
    setFooterClass(classNames(`footer`, footerClassName));
  }, [footerClassName]);

  useEffect(() => {
    setContainerClass(classNames(`container`, containerClassName));
  }, [containerClassName]);

  useEffect(() => {
    // Temporary solution, should have used the custmDocument of NextJs
    // Right now there is a warning Expected server HTML to contain a matching <div> in <header>
    const themeClass = userState?.theme?.dark ? 'theme-dark' : 'theme-light';
    if (bodyClassName) document.querySelector('body').classList.add(bodyClassName);
    document.querySelector('body').classList.add(themeClass);
  }, []);

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name='description' content={seo.description} />
        <meta name='image' content={seo.image} />
        <meta property='og:title' content={seo.title} />
        <meta property='og:description' content={seo.description} />
        <meta property='og:image:alt' content={seo.description} />
      </Head>
      <Flash />
      {compareConnectAlert && userState?.compare_connect?.url && (
        <CompareAndConnectAlert
          user={userState && userOptionObj({ ...userState })}
          headerClassName={headerClassName}
        />
      )}
      <Header
        user={userState && userOptionObj({ ...userState })}
        isBuildingProfile={isBuildingProfile}
        isConnectionPage={isConnectionPage}
        currentBuilding={buildingProfile}
        headerClassName={headerClassName}
      />
      <div className={mainContentClass}>
        <div className={containerClass}>
          {!hideBannersBar && userState?.isStrataMember && <BannersBar />}
          {children}
        </div>
        <Footer classNames={footerClass} currentUser={userState} />
      </div>

      <ModalRoot />
    </>
  );
};

Layout.defaultProps = {
  compareConnectAlert: true
};
