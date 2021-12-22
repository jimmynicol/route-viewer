import React, { cloneElement, useEffect } from "react";

export const Polyline: React.ComponentType<{
    encodedPath: string;
    map?: google.maps.Map;
    style?: google.maps.PolylineOptions;
    children?: React.ReactNode;
    onClick?: () => void;
}> = ({ encodedPath, map, style, children, onClick }) => {
    useEffect(() => {
        if (!encodedPath) return;

        const path = google.maps.geometry.encoding.decodePath(encodedPath);
        const line = new google.maps.Polyline({
            ...style,
            path,
        });

        if (onClick) {
            line.addListener("click", onClick);
        }

        if (map) line.setMap(map);
    }, [encodedPath, map, style, onClick]);

    return (
        <>
            {children &&
                React.Children.map(
                    children as JSX.Element[],
                    (child: React.ReactElement) =>
                        cloneElement(child, { ...child.props, map })
                )}
        </>
    );
};
