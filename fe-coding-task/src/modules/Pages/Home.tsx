import {BarChartsWrapper, DateRangeForm} from "../PropertyStatistics";
import React from "react";

export const HomePage = () => {
    return (
        <div className="flex m-10 justify-center items-center">
            <div className="p-10 flex flex-col justify-center items-center bg-white rounded-3xl">
                <header className="px-10">
                    <p className="py-10">
                        Norway statistics on the average price per square meter
                    </p>
                </header>
                <DateRangeForm/>
                <BarChartsWrapper/>
            </div>
        </div>
    )
}