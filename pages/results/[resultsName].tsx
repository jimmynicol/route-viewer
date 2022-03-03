import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "react-query";
import { ResultsApp } from "../../components/Apps/ResultsApp";
import { APITokenProvider } from "../../contexts/APIToken";
import { AuthStateProvider } from "../../contexts/AuthState";
import { ResultsDataProvider } from "../../contexts/ResultsData";

const queryClient = new QueryClient();

const Results: NextPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <APITokenProvider>
                <AuthStateProvider>
                    <ResultsDataProvider>
                        <ResultsApp />
                    </ResultsDataProvider>
                </AuthStateProvider>
            </APITokenProvider>
        </QueryClientProvider>
    );
};

export default Results;
