import {QueryClient} from "react-query";
import {PropsWithChildren} from "react";
import {ReactQueryProvider} from "./react-query";
import {ApiContextProvider} from "../api/Api.context";
import { PropertyStatisticsContextProvider } from "../PropertyStatistics";
import {SearchHistoryProvider} from "../SearchHistory";

interface IAppProviderProps {
    queryClient?: QueryClient
}

export const AppProvider = ({ children }: PropsWithChildren<IAppProviderProps>) => {
    return (
        <ReactQueryProvider>
            <ApiContextProvider>
                <SearchHistoryProvider>
                    <PropertyStatisticsContextProvider>
                    {children}
                </PropertyStatisticsContextProvider>
                </SearchHistoryProvider>
            </ApiContextProvider>
        </ReactQueryProvider>
    )
}