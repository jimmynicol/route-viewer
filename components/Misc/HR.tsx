import React from "react";

export const HR: React.ComponentType<React.HTMLAttributes<HTMLDivElement>> = ({
    style,
    ...props
}) => {
    return (
        <div
            {...props}
            style={{
                ...style,
                border: "none",
                height: 0.5,
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
        ></div>
    );
};
