import React from "react";
import { Marker } from "./Marker";

export const circleFillPath =
    "M29.9475268,59.5867724 C46.1333288,59.5867724 59.534715,46.15661 59.534715,29.9998218 C59.534715,13.8140198 46.1043387,0.412871288 29.9185367,0.412871288 C13.7617248,0.412871288 0.36059406,13.8140198 0.36059406,29.9998218 C0.36059406,46.15661 13.7907743,59.5867724 29.9475268,59.5867724 Z";

export const RouteStartMarker: React.ComponentType<{
    map?: google.maps.Map;
    path?: google.maps.LatLng[];
}> = ({ map, path }) => {
    if (!map || !path) return null;

    const position = path[0];
    const iconOpts = {
        path: circleFillPath,
        strokeColor: "#03A10E",
        fillColor: "#03A10E",
        fillOpacity: 1,
        rotation: 0,
        anchor: new google.maps.Point(15, 30),
        scale: 0.3,
        map,
    };

    return <Marker map={map} icon={iconOpts} position={position} />;
};

export const RouteEndMarker: React.ComponentType<{
    map?: google.maps.Map;
    path?: google.maps.LatLng[];
}> = ({ map, path }) => {
    if (!map || !path) return null;

    const position = path[path.length - 1];
    const iconOpts = {
        path: circleFillPath,
        strokeColor: "#FF0000",
        fillColor: "#FF0000",
        fillOpacity: 1,
        rotation: 0,
        anchor: new google.maps.Point(15, 30),
        scale: 0.3,
        map,
    };

    return <Marker map={map} icon={iconOpts} position={position} />;
};
