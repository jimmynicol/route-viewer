import React, { useEffect, useState } from "react";
import { useGeolocation } from "../../contexts/Geolocation";

import { DetailedSegment, Route } from "../../data/stravaDataTypes";
import { ColorScheme, useColorScheme } from "../../utils/useColorScheme";
import { Controls } from "../Controls/Controls";
import { UnitSwitcher } from "../UnitSwitcher/UnitSwitcher";
import { UserLocation } from "../UserLocation/UserLocation";
import { ZoomIn } from "../ZoomControls/ZoomIn";
import { ZoomOut } from "../ZoomControls/ZoomOut";
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

const arrow =
    "M1.99341501,26.8260894 C0.99537105,27.8885509 0.480294129,29.1118916 0.480294129,30.5606608 C0.480294129,33.5225509 2.89486556,35.969318 5.82451392,35.969318 C7.30545898,35.969318 8.68981063,35.3576279 9.78444799,34.2308147 L30.1313052,13.2078696 L50.4137448,34.2308147 C51.5083821,35.3898037 52.9249096,35.969318 54.3736788,35.969318 C57.3033272,35.969318 59.7179646,33.5225509 59.7179646,30.5606608 C59.7179646,29.0797158 59.2346679,27.8563092 58.2047777,26.8583311 L34.5418986,2.61595751 C33.1897228,1.23160586 31.8053711,0.619935527 30.0990634,0.587693768 C28.4249975,0.587693768 27.0406458,1.23160586 25.6562942,2.61595751 L1.99341501,26.8260894 Z";

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

    const zoomInMap = (map: google.maps.Map) => {
        const currZoom = map.getZoom();
        map.setZoom(typeof currZoom !== "undefined" ? currZoom + 1 : 0);
    };

    const zoomOutMap = (map: google.maps.Map) => {
        const currZoom = map.getZoom();
        map.setZoom(typeof currZoom !== "undefined" ? currZoom - 1 : 0);
    };

    const defaultMapsOptions: google.maps.MapOptions = {
        center: defaultCenter,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
    };

    const directionArrow = {
        icon: {
            path: arrow,
            strokeColor: "#FFFFFF",
            strokeWeight: 1,
            fillColor: "#FFFFFF",
            fillOpacity: 1,
            anchor: { x: 32, y: 32 } as google.maps.Point,
            scale: 0.1,
        },
        repeat: "40px",
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
                        strokeColor:
                            colorScheme === ColorScheme.LIGHT
                                ? "#3A4968"
                                : "#0087CA",
                        strokeWeight: 6,
                        zIndex: 3,
                        icons: [directionArrow],
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
                        strokeColor: "#FF4500",
                        strokeWeight: 8,
                        zIndex: 4,
                    }}
                    onClick={() => setCurrentSegment(segment)}
                ></Polyline>
            ))}
            <UserLocationMarker
                wantsGeolocation={wantsGeolocation}
                location={location}
            />
            <Controls style={{ top: 10, left: 10 }}>
                <UnitSwitcher />
                <UserLocation />
            </Controls>
            <Controls style={{ top: 10, right: 10 }}>
                <ZoomIn onClick={zoomInMap} />
                <ZoomOut onClick={zoomOutMap} />
            </Controls>
        </GoogleMap>
    );
};
