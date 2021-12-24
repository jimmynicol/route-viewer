import React from "react";

import { Marker } from "./Marker";
import { circleFillPath } from "./RouteMarkers";

export const SegmentMarker: React.ComponentType<{
    map?: google.maps.Map;
    path?: google.maps.LatLng[];
}> = ({ map, path }) => {
    if (!map || !path) return null;

    const position = path[Math.round(path.length / 2)];
    const iconOpts = {
        path: circleFillPath,
        strokeColor: "#FF0000",
        fillColor: "#FF0000",
        fillOpacity: 1,
        rotation: 0,
        anchor: new google.maps.Point(15, 30),
        scale: 0.2,
        map,
    };

    return <Marker map={map} icon={iconOpts} position={position} label={"1"} />;
};
