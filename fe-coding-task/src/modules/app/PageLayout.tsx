import React, {PropsWithChildren} from "react";

interface IAppLayoutProps {
    pageTitle: string
}

export const PageLayout = ({children, pageTitle}: PropsWithChildren<IAppLayoutProps>) => {
    return (
        <div className="w-full bg-white rounded-3xl ">
            <div className="p-10">
                <header className="text-3xl font-bold">
                    {pageTitle}
                </header>
                {children}
            </div>
        </div>
    )
}