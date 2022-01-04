import React, { useEffect } from "react";

const arrow =
    "M1.99341501,26.8260894 C0.99537105,27.8885509 0.480294129,29.1118916 0.480294129,30.5606608 C0.480294129,33.5225509 2.89486556,35.969318 5.82451392,35.969318 C7.30545898,35.969318 8.68981063,35.3576279 9.78444799,34.2308147 L30.1313052,13.2078696 L50.4137448,34.2308147 C51.5083821,35.3898037 52.9249096,35.969318 54.3736788,35.969318 C57.3033272,35.969318 59.7179646,33.5225509 59.7179646,30.5606608 C59.7179646,29.0797158 59.2346679,27.8563092 58.2047777,26.8583311 L34.5418986,2.61595751 C33.1897228,1.23160586 31.8053711,0.619935527 30.0990634,0.587693768 C28.4249975,0.587693768 27.0406458,1.23160586 25.6562942,2.61595751 L1.99341501,26.8260894 Z";

export const DirectionMarker: React.ComponentType<{
    line?: google.maps.Polyline;
}> = ({ line }) => {
    useEffect(() => {
        if (!line) return;

        const symbol = {
            path: arrow,
            strokeColor: "#FFFFFF",
            // fillColor: "#FFFFFF",
            repeat: "10%",
        };

        line.setOptions({ icons: [symbol] });
    }, [line]);

    return <></>;
};
