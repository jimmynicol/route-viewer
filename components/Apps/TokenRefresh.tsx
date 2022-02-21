import React, { useEffect } from "react";
import cw from "classnames";

import { useAPITokenContext } from "../../contexts/APIToken";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { TokenExchangeResponse } from "../../data/stravaDataTypes";
import { useTokenRefresh } from "../../data/useOAuth";

import typography from "../../styles/Typography.module.css";
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
                <h2
                    className={cw(loadingStyles.title, typography.titleReduced)}
                >
                    Retrieving Access Token...
                </h2>
            </div>
        );
    }

    if (isError) {
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
