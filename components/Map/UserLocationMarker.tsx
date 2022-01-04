import React, { useEffect, useRef } from "react";

export const UserLocationMarker: React.ComponentType<{
    wantsGeolocation: boolean;
    location: GeolocationCoordinates | null;
    map?: google.maps.Map;
}> = ({ wantsGeolocation, location, map }) => {
    const marker = useRef<google.maps.Marker | null>(null);

    useEffect(() => {
        if (!map) return;
        if (!location) return;

        if (!marker.current) {
            const position = {
                lat: location?.latitude,
                lng: location?.longitude,
            };

            const iconOpts = {
                url: "/location.svg",
                scale: 0.6,
            };
            marker.current = new google.maps.Marker({
                position,
                icon: iconOpts,
            });
        }

        marker.current.setMap(wantsGeolocation ? map : null);
    }, [map, location, wantsGeolocation, marker]);

    return <></>;
};
