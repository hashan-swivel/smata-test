import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Banner from './Banner';

const BannersBar = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [activeBanners, setActiveBanners] = useState([]);

  useEffect(() => {
    setActiveBanners(getActiveBanners());
  }, [currentUser]);

  const getActiveBanners = () => {
    if (!currentUser) return [];

    const { global_banners, organisation_banners } = currentUser;

    return [...(global_banners ?? []), ...(organisation_banners ?? [])].filter(
      (banner) => window.localStorage.getItem(`smata.alert.${banner.token}`) === null
    );
  };

  const handleDismiss = (token) => {
    window.localStorage.setItem(`smata.alert.${token}`, 'dismissed');
    setActiveBanners(activeBanners.filter((banner) => banner.token !== token));
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div className='banners'>
      {activeBanners.map((banner) => (
        <Banner key={banner.id} banner={banner} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};

export default BannersBar;
