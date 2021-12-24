import React, { cloneElement, useEffect, useRef, useState } from "react";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { ColorScheme } from "../../utils/useColorScheme";

const darkTheme: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

function loadGoogleMap(
    apiKey: string,
    libraries: LoaderOptions["libraries"]
): Promise<typeof google> {
    const loader = new Loader({ apiKey, libraries });
    return loader.load();
}

export const GoogleMap: React.ComponentType<{
    apiKey: string;
    libraries: LoaderOptions["libraries"];
    children: React.ReactNode;
    colorScheme?: ColorScheme;
    styles?: React.CSSProperties;
    options?: google.maps.MapOptions;
    boundingEncodedPath?: string;
}> = ({
    apiKey,
    libraries,
    colorScheme = ColorScheme.LIGHT,
    children,
    styles,
    options,
    boundingEncodedPath,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [googleMap, setGoogleMap] = useState<google.maps.Map>();

    useEffect(() => {
        if (googleMap) return;

        loadGoogleMap(apiKey, libraries).then((google) => {
            if (!ref.current) return;

            const _options: google.maps.MapOptions = options || {};
            if (colorScheme === ColorScheme.DARK) {
                _options.styles = (_options.styles || []).concat(...darkTheme);
            }

            const map = new google.maps.Map(ref.current, _options);
            setGoogleMap(map);
        });
    }, [ref, googleMap, setGoogleMap, apiKey, libraries, options, colorScheme]);

    useEffect(() => {
        if (!googleMap) return;
        if (!boundingEncodedPath) return;

        const pathForBounds =
            google.maps.geometry.encoding.decodePath(boundingEncodedPath);

        const bounds = new google.maps.LatLngBounds();
        pathForBounds.forEach((pt: google.maps.LatLng) => {
            bounds.extend(pt);
        });

        if (googleMap) googleMap.fitBounds(bounds);
    }, [boundingEncodedPath, googleMap]);

    return (
        <div ref={ref} style={styles || { height: "100%", width: "100%" }}>
            {googleMap &&
                React.Children.map(
                    children as JSX.Element[],
                    (child: React.ReactElement) =>
                        child
                            ? cloneElement(child, {
                                  ...child.props,
                                  map: googleMap,
                              })
                            : null
                )}
        </div>
    );
};
