import {QueryClient} from "react-query";
import {PropsWithChildren} from "react";
import {ReactQueryProvider} from "./react-query";
import {ApiContextProvider} from "../api/Api.context";


interface IAppProviderProps {
    queryClient?: QueryClient
}

export const AppProvider = ({ children }: PropsWithChildren<IAppProviderProps>) => {
    return (
        <ReactQueryProvider>
            <ApiContextProvider>
                {children}
            </ApiContextProvider>
        </ReactQueryProvider>
    )
}