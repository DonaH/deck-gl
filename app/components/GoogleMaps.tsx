'use client';

import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
// import { mockGeo } from './mockGeo';

const GoogleMaps = () => {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <Map
        defaultCenter={{ lat: 34.0522342, lng: -118.2436849 }} // Los Angeles
        // defaultCenter={{ lat: 39.50, lng: -98.35 }} // United States
        defaultZoom={10}
        // defaultZoom={5}
        style={{ width: '100vw', height: '100vh' }}
      >
        <Marker position={{ lat: 34.0522342, lng: -118.2436849 }} />
	  </Map>
    </APIProvider>
  );
};

export default GoogleMaps;
