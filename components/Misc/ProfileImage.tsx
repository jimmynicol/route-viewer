import React from "react";
import cw from "classnames";

export const ProfileImage: React.ComponentType<{
    src: string;
    height?: number;
    width?: number;
    style?: React.CSSProperties;
    classNames?: string[];
}> = ({ src, height = 100, width = 100, style = {}, classNames }) => {
    return (
        <div
            className={cw(...(classNames || []))}
            style={{
                height,
                width,
                borderRadius: "100%",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(${src})`,
                ...style,
            }}
        ></div>
    );
};
