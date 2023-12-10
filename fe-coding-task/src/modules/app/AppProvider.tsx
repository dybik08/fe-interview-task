import {QueryClient} from "react-query";
import {PropsWithChildren} from "react";
import {ReactQueryProvider} from "./react-query";


interface IAppProviderProps {
    queryClient?: QueryClient
}

export const AppProvider = ({ children, queryClient }: PropsWithChildren<IAppProviderProps>) => {
    return (
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>
    )
}