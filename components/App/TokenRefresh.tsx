import React, { useEffect } from "react";
import { useAPITokenContext } from "../../contexts/APIToken";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { TokenExchangeResponse } from "../../data/stravaDataTypes";
import { useTokenRefresh } from "../../data/useOAuth";

import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";

export const TokenRefresh: React.ComponentType = () => {
    const { setAuthState } = useAuthStateContext();
    const { tokenResponse, setTokenResponse } = useAPITokenContext();
    const { refresh_token } = tokenResponse;

    const { isLoading, isError, data, error } = useTokenRefresh(refresh_token);

    useEffect(() => {
        if (!data) return;

        const newToken: TokenExchangeResponse = Object.create(tokenResponse);

        newToken.access_token = data.access_token;
        newToken.refresh_token = data.refresh_token;
        newToken.expires_at = data.expires_at;

        setTokenResponse(newToken);
        setAuthState(AuthState.VALID);
    }, [data, tokenResponse, setTokenResponse, setAuthState]);

    if (isLoading) {
        return (
            <div className={loadingStyles.loadingMessage}>
                <h3>Refreshing Access Token...</h3>
            </div>
        );
    }

    if (isError) {
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
