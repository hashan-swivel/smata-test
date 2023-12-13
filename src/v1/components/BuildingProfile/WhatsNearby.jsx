import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { axiosInstance } from '../../../utils';
import { MapStyles } from '../GoogleMapStyles';
import { Marker } from '../MapMarker';
import './WhatsNearby.module.scss';

const searchParams = [
  {
    name: 'cafe',
    amount: 3
  },
  {
    name: 'gas_station',
    amount: 2
  },
  {
    name: 'transit_station',
    amount: 3
  },
  {
    name: 'school',
    amount: 2
  },
  {
    name: 'post_office',
    amount: 1
  },
  {
    name: 'supermarket',
    amount: 1
  }
];

const itemLabel = (label) => {
  switch (label) {
    case 'cafe':
      return 'Cafe';
    case 'gas_station':
      return 'Petrol Station';
    case 'transit_station':
      return 'Transport';
    case 'school':
      return 'School';
    case 'secondary_school':
      return 'Highschool';
    case 'post_office':
      return 'Post Office';
    case 'supermarket':
      return 'Supermarket';
    default:
      return null;
  }
};

// Add icon key/value to each places result
const itemIcon = (label) => {
  switch (label) {
    case 'cafe':
      return 'restaurant';
    case 'dollar':
      return 'Petrol Station';
    case 'transit_station':
      return 'train';
    case 'school':
      return 'school';
    case 'secondary_school':
      return 'school';
    case 'post_office':
      return 'dollar';
    case 'supermarket':
      return 'dollar';
    default:
      return 'dollar';
  }
};

const nearByRadius = 2000; // meters

export const WhatsNearby = ({ buildingProfile }) => {
  const [nearbyResults, setNearbyResults] = useState([]);
  const [locationCoors, setlocationCoors] = useState({ lat: null, lng: null });

  useEffect(() => {
    let didCancel = false;

    const location = buildingProfile?.locations[0];
    if (!location.lat_lng) return;

    const lat = parseFloat(location.lat_lng.split(',')[0]);
    const lng = parseFloat(location.lat_lng.split(',')[1]);
    setlocationCoors({ lat, lng });

    async function getNearByPlaces() {
      const searchResults = [];

      searchParams.forEach(async (item) => {
        const url =
          'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
          `location=${location.lat_lng}` +
          `&radius=${nearByRadius}` +
          `&type=${item.name}` +
          `&key=${process.env.GOOGLE_MAP_API_KEY}`;

        try {
          const { data } = await axiosInstance.get(url);

          if (!didCancel) {
            for (let i = 0; i < item.amount; i += 1) {
              const result = data.results[i];
              result.label = itemLabel(result.types[0]);
              result.icon = itemIcon(result.types[0]);
              searchResults.push(result);
            }
            setNearbyResults([...searchResults]);
          }
        } catch (error) {
          if (!didCancel) console.log(error);
        }
      });
    }

    getNearByPlaces();

    return () => {
      didCancel = true;
      setNearbyResults([]);
    };
  }, [buildingProfile]);

  // Calculate straight line distance from building address to location of places result
  const calculateDistance = (lat, long) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a =
      0.5 -
      c((lat - locationCoors.lat) * p) / 2 +
      (c(locationCoors.lat * p) * c(lat * p) * (1 - c((long - locationCoors.lng) * p))) / 2;
    const km = 12742 * Math.asin(Math.sqrt(a));

    return Math.ceil((km * 1000) / 100) * 100;
  };

  if (!locationCoors.lat || !locationCoors.lng) return null;

  return (
    <>
      <div className='building-profile-component building-profile-map' style={{ height: '400px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_API_KEY }}
          center={locationCoors}
          initialCenter={locationCoors}
          defaultZoom={13.5}
          options={{ styles: MapStyles, scrollwheel: false }}
        >
          {nearbyResults.map((element, index) => (
            <Marker
              key={index}
              lat={element.geometry.location.lat}
              lng={element.geometry.location.lng}
              type={element.icon}
              name={element.name}
            />
          ))}
          <Marker lat={locationCoors.lat} lng={locationCoors.lng} type='main' />
        </GoogleMapReact>
      </div>
      <div className='building-profile-component'>
        <div className='whats-nearby-container'>
          <div className='mobile-view-header'>
            <h3 className='building-title-heading'>What's Nearby?</h3>
          </div>
          <div className='whats-nearby-grid-container'>
            {nearbyResults.map((item, index) => (
              <div key={index} className='single-nearby-item'>
                <div className={`icon icon-${item.icon}-dark nearby-icon`} />
                <div className='nearby-name-type-distance'>
                  <div className='nearby-name' title={`${item.name}`}>
                    {item.name}
                  </div>
                  <div className='nearby-type-distance'>
                    {itemLabel(item.types[0])} -{' '}
                    {calculateDistance(item.geometry.location.lat, item.geometry.location.lng)}m
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
