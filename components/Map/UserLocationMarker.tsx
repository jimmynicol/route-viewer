import React from "react";
import { Marker } from "./Marker";

export const UserLocationMarker: React.ComponentType<{
    location: GeolocationCoordinates;
    map?: google.maps.Map;
}> = ({ location, map }) => {
    if (!location && !map) return null;

    const position = {
        lat: location.latitude,
        lng: location.longitude,
    };

    const iconOpts = {
        // anchor: new google.maps.Point(21, 21),
        // size: new google.maps.Size(30, 30),
        url: "/location.svg",
        scale: 0.6,
    };

    return <Marker map={map} position={position} icon={iconOpts} />;
};
