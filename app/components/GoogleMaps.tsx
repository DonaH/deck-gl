'use client';

import React, { useMemo, useEffect, useState } from "react";
import mockGeo from "./mockGeo.json";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { GeoJsonLayer } from "@deck.gl/layers";
import { DeckGL } from "deck.gl";
import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { limitTiltRange } from '@vis.gl/react-google-maps';
import { picking } from "deck.gl";
import { mock } from "node:test";
import { MockGeo as MockGeoProperties } from "./mockGeoModel";

interface GeoFeature {
	type: string;
	geometry: {
	  type: string;
	  coordinates: number[][][];
	};
	properties: {
	  fill: string;
	  status: string;
	  published: string;
	  diameter_in: number;
	  feature_uuid: string;
	  "fill-opacity": number;
	  "stroke-width": number;
	  hail_map_uuid: string;
	  convective_date: string;
	  hail_algorithm_version: string;
	};
  }

  interface MockGeoProperties {
	features: GeoFeature[];
  }

const myHeaders = new Headers();
myHeaders.append("key", process.env.NEW_HT_API_KEY as string);
myHeaders.append("Content-Type", "application/json");

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const GOOGLE_MAP_ID = '';

const DeckGLOverlay = (props: any) => {
  const map = useMap();
  const overlay = useMemo(() => new DeckOverlay(props), [props]);

  useEffect(() => {
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [props]);

  overlay.setProps(props);
  return null;
};
// const INITIAL_VIEW_STATE = {
// 	longitude: -99.733147,
// 	latitude: 32.448734,
// 	zoom: 9,
// 	// pitch: 0,
// 	// bearing: 0
// };
// const geoJsonData = mockGeo as MockGeoProperties;

// const [features, setFeatures] = useState<GeoFeature[]>([]);

// useEffect(() => {
//   // Use setTimeout directly
//   setTimeout(() => {
//     setFeatures(geoJsonData.features); // Assuming mockGeo has a 'features' property
//   }, 1000); // 1000 ms delay
// }, []);

const GoogleMaps = () => {
	const INITIAL_VIEW_STATE = {
		longitude: -99.733147,
		latitude: 32.448734,
		zoom: 9,
		pitch: 0,
		bearing: 0
	};
	const geoJsonData = mockGeo as MockGeoProperties;
	
	const [features, setFeatures] = useState<GeoFeature[]>([]);
	
	useEffect(() => {
	  setTimeout(() => {
		setFeatures(geoJsonData.features);
	  }, 1000); // 1000 ms delay to simulate API call
	}, []);

  const layers = [
	new GeoJsonLayer({
    id: "geojson-layer",
    data: features,
    stroked: false,
    filled: true,
    pointType: "circle+text",
    pickable: true,
    getFillColor: (f) => {
      const hex = f.properties.fill;
      // convert hex to rgb
      if (!hex) return [0, 0, 0];
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    },
    opacity: 0.6,
    getLineWidth: 4,
    getPointRadius: 4,
    getTextSize: 12,
    picable: true,
    autoHighlight: true,
    // onClick
  })
];
  console.log("layers", layers);
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        // defaultCenter={{ lat: 34.0522342, lng: -118.2436849 }} // Los Angeles
        // defaultCenter={{ lat: 39.50, lng: -98.35 }} // United States
        defaultCenter={{ lat: 32.448734, lng: -99.733147 }} // Abilene TX
        defaultZoom={10}
        mapId={GOOGLE_MAP_ID}
        style={{ width: "100vw", height: "100vh" }}
      >
        <DeckGLOverlay layers={layers} />
        <Marker position={{ lat: 32.448734, lng: -99.733147 }} />
      </Map>
    </APIProvider>
  );
};

export default GoogleMaps;
