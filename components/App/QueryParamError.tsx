import React from "react";
import cw from "classnames";

import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";

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

    return (
        <div className={errorStyles.errorMessage}>
            <div className={_className}>
                <h2 className={cw(errorStyles.title, typography.titleReduced)}>
                    Error with address format.
                </h2>
                <p
                    className={cw(
                        errorStyles.description,
                        typography.bodyReduced
                    )}
                >
                    The route and segment information in the URL are not in the
                    correct format.
                </p>
                <br />
                <p
                    className={cw(
                        errorStyles.description,
                        typography.bodyReduced
                    )}
                >
                    The value for <strong>r</strong> should be a number
                    representing the Strava Route ID.
                </p>
                <br />
                <p
                    className={cw(
                        errorStyles.description,
                        typography.bodyReduced
                    )}
                >
                    The value for <strong>s</strong> should be a list of numbers
                    seperated by commas, each representing a Strava Segment ID.
                </p>
                <br />
                <p
                    className={cw(
                        errorStyles.description,
                        typography.bodyReduced
                    )}
                >
                    Please use something similar to:
                </p>
                <p
                    className={cw(
                        errorStyles.description,
                        typography.bodyReduced
                    )}
                >
                    <code className={typography.code}>
                        {currUrl}
                        ?r=2874856572&s=4243560,610571,21036783
                    </code>
                </p>
            </div>
        </div>
    );
};
