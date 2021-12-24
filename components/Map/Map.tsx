import React, { useEffect, useState } from "react";
import { useGeolocation } from "../../contexts/GeoLocation";

import { DetailedSegment, Route } from "../../data/stravaDataTypes";
import { useColorScheme } from "../../utils/useColorScheme";
import { GoogleMap } from "./GoogleMap";
import { Polyline } from "./Polyline";
import { RouteEndMarker, RouteStartMarker } from "./RouteMarkers";
import { SegmentMarker } from "./SegmentMarker";
import { UserLocationMarker } from "./UserLocationMarker";

export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

const defaultCenter = {
    lat: 37.3769764,
    lng: -122.1204581,
};

export const Map: React.ComponentType<{
    route: Route | undefined;
    segments: DetailedSegment[];
    currentSegment: DetailedSegment | null;
    setCurrentSegment: (value: DetailedSegment) => void;
}> = ({ route, segments, currentSegment, setCurrentSegment }) => {
    const colorScheme = useColorScheme();
    const { wantsGeolocation, location } = useGeolocation();
    const [encodedPathForBounds, setEncodedPathForBounds] = useState<string>();

    useEffect(() => {
        setEncodedPathForBounds(
            currentSegment ? currentSegment.map.polyline : route?.map.polyline
        );
    }, [currentSegment, route]);

    const defaultMapsOptions: google.maps.MapOptions = {
        center: defaultCenter,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControlOptions: { position: 7 },
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
    };

    return (
        <GoogleMap
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={["geometry"]}
            colorScheme={colorScheme}
            options={defaultMapsOptions}
            boundingEncodedPath={encodedPathForBounds}
        >
            {route && (
                <Polyline
                    encodedPath={route.map.polyline}
                    style={{
                        strokeColor: "#00008B",
                        strokeWeight: 4,
                        zIndex: 3,
                    }}
                >
                    <RouteStartMarker />
                    <RouteEndMarker />
                </Polyline>
            )}
            {segments.map((segment, i) => (
                <Polyline
                    key={i}
                    encodedPath={segment.map.polyline}
                    style={{
                        strokeColor: "#FF0000",
                        strokeWeight: 4,
                        zIndex: 4,
                    }}
                    onClick={() => setCurrentSegment(segment)}
                ></Polyline>
            ))}
            {wantsGeolocation && location && (
                <UserLocationMarker location={location} />
            )}
        </GoogleMap>
    );
};
