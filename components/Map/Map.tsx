import React, { useEffect, useState } from "react";

import { DetailedSegment, Route } from "../../data/stravaDataTypes";
import { useColorScheme } from "../../utils/useColorScheme";
import { GoogleMap } from "./GoogleMap";
import { Polyline } from "./Polyline";

enum CONTROL_POSITION {
    BOTTOM = 11,
    BOTTOM_CENTER = 11,
    BOTTOM_LEFT = 10,
    BOTTOM_RIGHT = 12,
    CENTER = 13,
    LEFT = 5,
    LEFT_BOTTOM = 6,
    LEFT_CENTER = 4,
    LEFT_TOP = 5,
    RIGHT = 7,
    RIGHT_BOTTOM = 9,
    RIGHT_CENTER = 8,
    RIGHT_TOP = 7,
    TOP = 2,
    TOP_CENTER = 2,
    TOP_LEFT = 1,
    TOP_RIGHT = 3,
}

export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

const defaultCenter = {
    lat: 37.3769764,
    lng: -122.1204581,
};

const circleFillPath =
    "M29.9475268,59.5867724 C46.1333288,59.5867724 59.534715,46.15661 59.534715,29.9998218 C59.534715,13.8140198 46.1043387,0.412871288 29.9185367,0.412871288 C13.7617248,0.412871288 0.36059406,13.8140198 0.36059406,29.9998218 C0.36059406,46.15661 13.7907743,59.5867724 29.9475268,59.5867724 Z";

export const Map: React.ComponentType<{
    route: Route | undefined;
    segments: DetailedSegment[];
    currentSegment: DetailedSegment | null;
    setCurrentSegment: (value: DetailedSegment) => void;
}> = ({ route, segments, currentSegment, setCurrentSegment }) => {
    const colorScheme = useColorScheme();
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
                />
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
                />
            ))}
        </GoogleMap>
    );
};
