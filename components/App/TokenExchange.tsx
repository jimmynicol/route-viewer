import React, { useEffect } from "react";
import { useAPITokenContext } from "../../contexts/APIToken";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import {
    clearOAuthQueryParams,
    useQueryParamsContext,
} from "../../contexts/QueryParams";
import { useTokenExchange } from "../../data/useOAuth";

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
                <h3>Retrieving Access Token...</h3>
            </div>
        );
    }

    if (isError) {
        clearOAuthQueryParams();

        return (
            <div className={errorStyles.errorMessage}>
                <h3>Error retrieving access token.</h3>
                <p>{error?.message}</p>
            </div>
        );
    }

    return (
        <div className={loadingStyles.loadingMessage}>
            <h3>Access Token Retrieved!</h3>
        </div>
    );
};
