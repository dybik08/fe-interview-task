import {useListPropertyStatistics, DateRangeApiFormat, HouseType} from "../api";
import {Bar} from "react-chartjs-2";
import React from "react";
import {DateRangeMapper, PropertyTypeMapper, BarChartMapper} from "../mappers";
import {usePropertyStatisticsSearchParams} from "../hooks";

export const BarChartsWrapper = () => {
    const {propertyTypeSearchParam, to, from} = usePropertyStatisticsSearchParams()
    
    if(!from || !to || !propertyTypeSearchParam) return null
    
    const propertyType = PropertyTypeMapper.mapSearchParamToPropertyType(propertyTypeSearchParam)
    
    const formValues = DateRangeMapper.mapQueryParamsToFormValues(from, to)
    const dateRange = DateRangeMapper.mapDateRangeToQuarterList(formValues)
    
    return (
        <>
            {dateRange && <BarCharts dateRange={dateRange} propertyType={propertyType} />}
        </>
    )
}

interface IBarChartsProps {
    dateRange: DateRangeApiFormat
    propertyType: HouseType[]
}

const BarCharts = ({dateRange, propertyType}: IBarChartsProps) => {

    const {error, loading, propertyStatistics} = useListPropertyStatistics(propertyType, dateRange )
    
    if(loading) {
        return <div className="my-10 w-96 flex justify-center items-center" >
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
    const barChartMapper = new BarChartMapper(labels, dateRange)
    
    const datasetSmahus = propertyStatistics[HouseType.Smahus]
    const datasetBolinger = propertyStatistics[HouseType.Boliger]
    const datasetBlokkleiligheter = propertyStatistics[HouseType.Blokkleiligheter]
    
    const dataSmahus = barChartMapper.mapDataSetToChartData(datasetSmahus, HouseType.Smahus)
    
    const dataBolinger = barChartMapper.mapDataSetToChartData(datasetBolinger, HouseType.Boliger)
 
    const dataBlokkleiligheter = barChartMapper.mapDataSetToChartData(datasetBlokkleiligheter, HouseType.Blokkleiligheter)

    return (
        <div className="w-96 space-y-6" >
            {/* smahus */}
            {datasetSmahus.length > 0 && <Bar options={options} data={dataSmahus}/>}
            {/* bolinger */}
            {datasetBolinger.length > 0 && <Bar options={options} data={dataBolinger}/>}
            {/* Blokkleiligheter */}
            {datasetBlokkleiligheter.length > 0 && <Bar options={options} data={dataBlokkleiligheter}/>}
        </div>
    )
}