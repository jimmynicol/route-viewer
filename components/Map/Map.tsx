import GoogleMapReact, {
    BootstrapURLKeys,
    Coords,
    MapOptions,
} from "google-map-react";
import React, { useEffect, useState } from "react";
import { DetailedSegment, Route } from "../../data/stravaDataTypes";

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

const bootstrapKeys: BootstrapURLKeys = {
    key: GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
};

const defaultCenter: Coords = {
    lat: 37.3769764,
    lng: -122.1204581,
};

const mapsOptions: MapOptions = {
    fullscreenControl: false,
    zoomControlOptions: { position: CONTROL_POSITION.RIGHT_TOP },
};

const circleFillPath =
    "M29.9475268,59.5867724 C46.1333288,59.5867724 59.534715,46.15661 59.534715,29.9998218 C59.534715,13.8140198 46.1043387,0.412871288 29.9185367,0.412871288 C13.7617248,0.412871288 0.36059406,13.8140198 0.36059406,29.9998218 C0.36059406,46.15661 13.7907743,59.5867724 29.9475268,59.5867724 Z";

function renderRoutePolyline(map: any, maps: any, route?: Route) {
    if (!route) return;

    const decode = maps.geometry.encoding.decodePath(route.map.polyline);
    const startPt = decode[0];
    const endPt = decode[decode.length - 1];

    const line = new maps.Polyline({
        path: decode,
        strokeColor: "#00008B",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex: 3,
    });

    const startSymbol = {
        path: circleFillPath,
        strokeColor: "#03A10E",
        fillColor: "#03A10E",
        fillOpacity: 1,
        rotation: 0,
        anchor: new google.maps.Point(15, 30),
        scale: 0.3,
    };

    const endSymbol = {
        path: circleFillPath,
        strokeColor: "#FF0000",
        fillColor: "#FF0000",
        fillOpacity: 1,
        rotation: 0,
        anchor: new google.maps.Point(15, 30),
        scale: 0.3,
    };

    new maps.Marker({
        position: startPt,
        icon: startSymbol,
        map,
    });

    new maps.Marker({
        position: endPt,
        icon: endSymbol,
        map,
    });

    line.setMap(map);
}

function renderSegmentPolylines(
    map: any,
    maps: any,
    segments: DetailedSegment[],
    setCurrentSegment: (value: DetailedSegment) => void
) {
    segments.forEach((segment: DetailedSegment) => {
        const encodedLine = segment.map.polyline;
        const decode = maps.geometry.encoding.decodePath(encodedLine);
        const line = new maps.Polyline({
            path: decode,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4,
            zIndex: 4,
        });
        line.addListener("click", () => setCurrentSegment(segment));
        line.setMap(map);
    });
}

function getBounds(maps: any, line: any) {
    const bounds = new maps.LatLngBounds();
    line.getPath().forEach((item: any) => {
        const latLng = new maps.LatLng(item.lat(), item.lng());
        bounds.extend(latLng);
    });
    return bounds;
}

function setMapBounds(source: Route | DetailedSegment | undefined) {
    if (!source) return;

    const encodedLine = source.map.polyline;
    const decode = google.maps.geometry.encoding.decodePath(encodedLine);
    const line = new google.maps.Polyline({
        path: decode,
    });

    currentMap.fitBounds(getBounds(google.maps, line));
}

let currentMap: any;

export const Map: React.ComponentType<{
    route: Route | undefined;
    segments: DetailedSegment[];
    currentSegment: DetailedSegment | null;
    setCurrentSegment: (value: DetailedSegment) => void;
}> = ({ route, segments, currentSegment, setCurrentSegment }) => {
    const [isMapsLoaded, setMapLoaded] = useState(false);

    const onMapLoad = ({ map, maps }: { map: any; maps: any }) => {
        currentMap = map;
        setMapLoaded(true);
        renderRoutePolyline(map, maps, route);
        renderSegmentPolylines(map, maps, segments, setCurrentSegment);
    };

    useEffect(() => {
        if (isMapsLoaded) {
            setMapBounds(currentSegment || route);
        }
    }, [currentSegment, route, isMapsLoaded]);

    return (
        <GoogleMapReact
            bootstrapURLKeys={bootstrapKeys}
            options={mapsOptions}
            defaultCenter={defaultCenter}
            defaultZoom={14}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={onMapLoad}
        />
    );
};
