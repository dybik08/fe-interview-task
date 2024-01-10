import {BarChartsWrapper, DateRangeForm} from "../PropertyStatistics";
import React from "react";
import {PageLayout} from "../app";

export const HomePage = () => {
    return (
        <PageLayout pageTitle="Search History">
            <div className="mt-10 space-y-6 flex flex-col justify-center items-center ">
                <p className="text-xl">
                    Norway statistics on the average price per square meter
                </p>
                <DateRangeForm/>
                <BarChartsWrapper/>
            </div>
        </PageLayout>
    )
}