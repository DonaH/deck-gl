"use client";

import React, { useMemo, useEffect, useState } from "react";
import mockGeo from "./mockGeo.json";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { GeoJsonLayer } from "@deck.gl/layers";
import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { Map as MapsTypeGoogle } from "@types/googlemaps";
import {
  FeatureCollection,
  Feature,
  Geometry,
  Properties,
} from "./mockGeoModel";

const myHeaders = new Headers();
myHeaders.append("key", process.env.NEW_HT_API_KEY as string);
myHeaders.append("Content-Type", "application/json");

const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const GOOGLE_MAP_ID = "";

const HailTraceMaps = () => {
  const [mbr, setMbr] = useState({
    nw: "",
    ne: "",
    se: "",
    sw: "",
    // nw: "49.2827 -123.1207",
    // ne: "25.7617 -123.1207",
    // se: "25.7617 -80.1918",
    // sw: "49.2827 -80.1918",
  });

  const updateMbr = (map: MapsTypeGoogle) => {
    if (typeof map.getBounds === "function") {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const nw = { lat: ne.lat(), lng: sw.lng() };
      const se = { lat: sw.lat(), lng: ne.lng() };

      setMbr({
        nw: `${nw.lat} ${nw.lng}`,
        ne: `${ne.lat()} ${ne.lng()}`,
        se: `${se.lat} ${se.lng}`,
        sw: `${sw.lat()} ${sw.lng}`,
      });
      console.log("mbr", mbr);
    } else {
      console.error(
        "map.getBounds is not a function. Ensure map is correctly initialized."
      );
    }
  };

  const params = JSON.stringify({
    mbr: {
      nw: "49.2827 -123.1207",
      ne: "25.7617 -123.1207",
      se: "25.7617 -80.1918",
      sw: "49.2827 -80.1918",
    },
    dateRange: {
      min: "2024-06-01 00:00:00",
      max: "2024-06-20 00:00:00",
    },
    // optional
    // min max date range
    // optional
    // type is number
    //"diameterInch": 1.0
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: params,
    redirect: "follow",
  };

  const DeckGLOverlay = ({ layers }: { layers: GeoJsonLayer[] }) => {
    const map = useMap();
    const overlay = useMemo(() => new DeckOverlay({ layers }), [layers]);

    useEffect(() => {
      overlay.setMap(map);
      return () => overlay.setMap(null);
    }, [map, layers]);

    // overlay.setProps(layers);
    return null;
  };

  const INITIAL_VIEW_STATE = {
    longitude: -99.733147,
    latitude: 32.448734,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  };
  const [features, setFeatures] = useState<Feature[]>([]);
  const geoJsonData = mockGeo as FeatureCollection;

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
      picable: true,
      getFillColor: (f) => {
        const hex = f.properties?.fill;
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
      autoHighlight: true,
      // onClick
    }),
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
        onBoundsChanged={(map) => updateMbr(map)}
      >
        <DeckGLOverlay layers={layers} />
        <Marker position={{ lat: 32.448734, lng: -99.733147 }} />
      </Map>
    </APIProvider>
  );
};

export default HailTraceMaps;
