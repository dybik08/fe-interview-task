import {BarChartsWrapper, DateRangeForm} from "../PropertyStatistics";
import React from "react";

export const HomePage = () => {
    return (
        <div className="w-full bg-white rounded-3xl ">
            <div className="p-10" >
                <header className="text-3xl font-bold">
                    Dashboard
                </header>
                <div className="mt-10 space-y-6 flex flex-col justify-center items-center ">
                    <p className="text-xl">
                        Norway statistics on the average price per square meter
                    </p>
                    <DateRangeForm/>
                    <BarChartsWrapper/>
                </div>
            </div>
        </div>
    )
}