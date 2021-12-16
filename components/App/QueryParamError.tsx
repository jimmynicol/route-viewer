import React from "react";

import errorStyles from "../../styles/ErrorMessage.module.css";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

export const QueryParamsError: React.ComponentType = () => {
    const sizeClass = useHorizontalSizeClass();

    let currUrl;

    if (typeof window === "undefined") {
        currUrl = "";
    } else {
        currUrl = new URL(window.location.href).origin;
    }

    const _className =
        sizeClass === SizeClass.COMPACT
            ? errorStyles.compact
            : errorStyles.regular;

    console.log(
        "sizeClass",
        sizeClass,
        sizeClass === SizeClass.COMPACT,
        _className
    );

    return (
        <div className={errorStyles.errorMessage}>
            <div className={_className}>
                <h3>Error with address format.</h3>
                <p>
                    The route and segment information in the URL are not in the
                    correct format.
                </p>
                <br />
                <p>
                    The value for <strong>r</strong> should be a number
                    representing the Strava Route ID.
                </p>
                <br />
                <p>
                    The value for <strong>s</strong> should be a list of numbers
                    seperated by commas, each representing a Strava Segment ID.
                </p>
                <br />
                <p>Please use something similar to:</p>
                <p>
                    <code>
                        {currUrl}
                        ?r=2874856572&s=4243560,610571,21036783
                    </code>
                </p>
            </div>
        </div>
    );
};
