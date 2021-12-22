import React, { useEffect } from "react";
import cw from "classnames";

import { useAPITokenContext } from "../../contexts/APIToken";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import {
    clearOAuthQueryParams,
    useQueryParamsContext,
} from "../../contexts/QueryParams";
import { useTokenExchange } from "../../data/useOAuth";

import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";

export const TokenExchange: React.ComponentType = () => {
    const { setAuthState } = useAuthStateContext();
    const {
        queryParams: { authorizationCode },
    } = useQueryParamsContext();
    const { setTokenResponse } = useAPITokenContext();

    const { isLoading, isError, data, error } = useTokenExchange(
        authorizationCode || ""
    );

    useEffect(() => {
        if (!data) return;

        clearOAuthQueryParams();
        setTokenResponse(data);
        setAuthState(AuthState.VALID);
    }, [data, setAuthState, setTokenResponse]);

    if (isLoading) {
        return (
            <div className={loadingStyles.loadingMessage}>
                <h2
                    className={cw(loadingStyles.title, typography.titleReduced)}
                >
                    Retrieving Access Token...
                </h2>
            </div>
        );
    }

    if (isError) {
        clearOAuthQueryParams();

        return (
            <div className={errorStyles.errorMessage}>
                <h2 className={cw(errorStyles.title, typography.titleReduced)}>
                    Error retrieving access token.
                </h2>
                <p
                    className={cw(
                        errorStyles.description,
                        typography.bodyReduced
                    )}
                >
                    {error?.message}
                </p>
            </div>
        );
    }

    return (
        <div className={loadingStyles.loadingMessage}>
            <h2 className={cw(loadingStyles.title, typography.titleReduced)}>
                Access Token Retrieved!
            </h2>
        </div>
    );
};
