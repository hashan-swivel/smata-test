import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { MapStyles } from '../GoogleMapStyles';
import { Marker } from '../MapMarker';
import { googleMapConstants } from '../../../constants';

import './WhatsNearby.module.scss';

export const GoogleMap = ({ lat_lng }) => {
  const [locationCoors, setLocationCoors] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (lat_lng)
      setLocationCoors({
        lat: parseFloat(lat_lng.split(',')[0]),
        lng: parseFloat(lat_lng.split(',')[1])
      });
  }, []);

  if (!locationCoors.lat || !locationCoors.lng) return null;

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_API_KEY }}
      center={locationCoors}
      initialCenter={locationCoors}
      defaultZoom={googleMapConstants.DEFAULT_ZOOM_LEVEL}
      options={{ styles: MapStyles, scrollwheel: googleMapConstants.DEFAULT_SCROLL_WHEEL_SETTING }}
    >
      <Marker lat={locationCoors.lat} lng={locationCoors.lng} type='main' />
    </GoogleMapReact>
  );
};
