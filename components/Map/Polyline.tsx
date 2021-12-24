import React, { cloneElement, useEffect, useState } from "react";

export const Polyline: React.ComponentType<{
    encodedPath: string;
    map?: google.maps.Map;
    style?: google.maps.PolylineOptions;
    children?: React.ReactNode;
    onClick?: () => void;
}> = ({ encodedPath, map, style, children, onClick }) => {
    const [path, setPath] = useState<google.maps.LatLng[]>();

    useEffect(() => {
        if (!encodedPath) return;

        const _path = google.maps.geometry.encoding.decodePath(encodedPath);
        const line = new google.maps.Polyline({
            ...style,
            path: _path,
        });

        if (onClick) {
            line.addListener("click", onClick);
        }

        if (map) line.setMap(map);
        setPath(_path);
    }, [encodedPath, map, style, onClick, setPath]);

    return (
        <>
            {children &&
                path &&
                React.Children.map(
                    children as JSX.Element[],
                    (child: React.ReactElement) =>
                        cloneElement(child, { ...child.props, map, path })
                )}
        </>
    );
};
