import {useListHouseStatistics} from "../../api/HouseStatistics.controller";
import {DateRangeApiFormat, HouseType} from "../../api/HouseStatistics.api";
import {Bar} from "react-chartjs-2";
import React from "react";
import {useSearchParams} from "react-router-dom";
import {DateRangeMapper} from "../../HouseStatistics/mappers";

const mapHouseTypeToString = (houseType: HouseType) => {
    if(HouseType.Smahus) return "Smahus"
    if(HouseType.Boliger) return "Boliger"

    return "Blokkleiligheter"
}

export const BarChartWrapper = () => {
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    
    if(!from || !to) return null
    
    const formValues = DateRangeMapper.mapQueryParamsToFormValues(from, to)
    const dateRange = DateRangeMapper.mapDateRangeToQuarterList(formValues)
    
    return (
        <>
            {dateRange && <BarChart dateRange={dateRange} />}
        </>
    )
}

interface IBarChartProps {
    dateRange: DateRangeApiFormat
}

const BarChart = ({dateRange}: IBarChartProps) => {

    const {error, loading, houseStatistics} = useListHouseStatistics([HouseType.Smahus], dateRange )
    
    if(loading) {
        return <div className="my-10 w-96 flex justify-center items-center" >
            {/*<Skeleton variant="rectangular" width={400} height={118}/>*/}
            <div className="loader"/>
        </div>
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Price per SQM',
            },
        },
    };

    const labels = dateRange.map(quarter => quarter)

    const data = {
        labels,
        datasets: [
            {
                label: mapHouseTypeToString(HouseType.Smahus),
                data: dateRange.map((_, index) => {
                    return houseStatistics.data.value[index]
                }),
                backgroundColor: 'rgba(26, 179, 37, 0.8)',
            },
        ],
    };

    return (
        <div className="w-96" >
            <Bar options={options} data={data} />
        </div>
    )
}