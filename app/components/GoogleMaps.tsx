"use client";

import React, {useMemo, useEffect} from "react";
import mockGeo from "./mockGeo.json";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { GeoJsonLayer } from "@deck.gl/layers";
import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';



function DeckGLOverlay(props: any) {
	const map = useMap();
  	const overlay = useMemo(() => new DeckOverlay(props), [props]);
  
	useEffect(() => {
	  overlay.setMap(map);
	  return () => overlay.setMap(null);
	}, [map])
  
	overlay.setProps(props);
	return null;
  }


const GoogleMaps = () => {
  const layers = new GeoJsonLayer({
    id: "GeoJsonLayer",
    data: [mockGeo as any],
	
    stroked: false,
    filled: true,
    pointType: 'circle+text',
    pickable: true,
    getFillColor: f => {
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
  });
  console.log('layers', layers);
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <Map
        // defaultCenter={{ lat: 34.0522342, lng: -118.2436849 }} // Los Angeles
        defaultCenter={{ lat: 32.448734, lng: -99.733147 }} // Abilene TX
        defaultZoom={12}
		mapId={"GeoJsonLayer"}
        // defaultCenter={{ lat: 39.50, lng: -98.35 }} // United States
        // defaultZoom={5}
        style={{ width: "100vw", height: "100vh" }}
      >
		<DeckGLOverlay layers={layers} />
        {/* <Marker position={{ lat: 34.0522342, lng: -118.2436849 }} /> */}
        <Marker position={{ lat: 32.448734, lng: -99.733147 }} />
      </Map>
    </APIProvider>
  );
};

export default GoogleMaps;
