import { TokenExchangeResponse } from "./stravaDataTypes";
import { useLocalStorage } from "./useLocalStorage";

const defaultApiToken = {} as TokenExchangeResponse;

export function useToken() {
    const key = "route-viewer.apiToken";
    return useLocalStorage<TokenExchangeResponse>(key, defaultApiToken);
}
