'use client';

import React, { useMemo, useEffect, useState, useCallback } from "react";
import mockGeo from "./mockGeo.json";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { GeoJsonLayer, GeoJsonLayerProps } from "@deck.gl/layers";
import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { FeatureCollection, Feature } from "./mockGeoModel";

const myHeaders = new Headers();
myHeaders.append("key", process.env.NEXT_PUBLIC_NEW_HT_API_KEY as string);
myHeaders.append("Content-Type", "application/json");

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const GOOGLE_MAP_ID = "";

const HailTraceMaps = () => {
	// minimum bounding rectangle
	const [mbr, setMbr] = useState({
		// nw: "",
		// ne: "",
		// se: "",
		// sw: "",
		nw: "49.2827 -123.1207",  // Abilene TX
		ne: "25.7617 -123.1207",
		se: "25.7617 -80.1918",
		sw: "49.2827 -80.1918",
	});

	const updateMbr = useCallback((event: any) => {
		console.log("event triggered", event);

		if (event.detail && event.detail.bounds) {
		const newMbr = event.detail.bounds;
		// Calculate map corners
		const nw = { lat: newMbr.north, lng: newMbr.west };
		const ne = { lat: newMbr.north, lng: newMbr.east };
		const se = { lat: newMbr.south, lng: newMbr.east };
		const sw = { lat: newMbr.south, lng: newMbr.west };

		// Log corners
		console.log("NW:", nw);
		console.log("NE:", ne);
		console.log("SE:", se);
		console.log("SW:", sw);

		// Convert the corner objects to strings
		let nwStr = `${nw.lat} ${nw.lng}`;
		let neStr = `${ne.lat} ${ne.lng}`;
		let seStr = `${se.lat} ${se.lng}`;
		let swStr = `${sw.lat} ${sw.lng}`;

		setMbr({
			nw: nwStr,
			ne: neStr,
			se: seStr,
			sw: swStr,
		});
		// console.log("mbr", mbr);
		} else if (event.error) {
		console.error("Error getting bounds in map", event.error);
		} else {
		console.error(
			"Error: event.detail or event.detail.bounds is undefined in map."
		);
		}
	}, []);

	// Use effect to log the updated mbr
	useEffect(() => {
		console.log("Updated mbr:", mbr);
	}, [mbr]);

	const params = JSON.stringify({
		mbr: mbr,
		dateRange: {
		min: "2024-06-01 00:00:00",
		max: "2024-06-10 00:00:00",
		},
		// optional
		// min max date range (default is all data, increment daily)
		// optional
		// type is number
		//"diameterInch": 1.0
	});

	const requestOptions: RequestInit = {
		method: "POST",
		headers: myHeaders,
		body: params,
		redirect: "follow",
	};

	const [features, setFeatures] = useState<Feature[]>([]);

	// ** setup for local mock data **
	// const geoJsonData = mockGeo as FeatureCollection;

	// useEffect(() => {
	// setTimeout(() => {
	// 	setFeatures(geoJsonData.features);
	// }, 1000); // 1000 ms delay to simulate API call
	// }, []);
	// ** end setup for local mock data **

	useEffect(() => {
		fetch(
		"https://hailtrace-microservice-x7xzzdp35a-uk.a.run.app/api/hail-trace/get-feature",
		requestOptions
		)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			setFeatures(data.features);
		});
	}, [mbr]);

	const layers = [
		new GeoJsonLayer({
		id: "geojson-layer",
		data: features as GeoJsonLayerProps["data"],
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

	const DeckGLOverlay = ({ layers }: { layers: GeoJsonLayer[] }) => {
		const map = useMap();
		const overlay = useMemo(() => new DeckOverlay({ layers }), [layers]);

		useEffect(() => {
		if (map) {
			overlay.setMap(map);
		}
		return () => {
			if (map) {
			overlay.setMap(null);
			}
		};
		}, [map, layers]);

		return null;
	};

	return (
		<APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
		<Map
			// defaultCenter={{ lat: 34.0522342, lng: -118.2436849 }} // Los Angeles
			// defaultCenter={{ lat: 39.50, lng: -98.35 }} // United States
			defaultCenter={{ lat: 32.448734, lng: -99.733147 }} // Abilene TX
			defaultZoom={8}
			mapId={GOOGLE_MAP_ID}
			style={{ width: "100vw", height: "100vh" }}
			onBoundsChanged={updateMbr}
		>
			<DeckGLOverlay layers={layers} />
			<Marker position={{ lat: 32.448734, lng: -99.733147 }} />
		</Map>
		</APIProvider>
	);
};

export default HailTraceMaps;