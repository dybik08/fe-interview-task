import {BarChartMapper, HouseStatisticsReadModel, HouseType} from "../../PropertyStatistics";
import {Bar} from "react-chartjs-2";
import React from "react";

interface ISelectedHistoryEntryBarChartsProps {
    dateRange: string[]
    propertyStatistics: HouseStatisticsReadModel
}

export const SelectedHistoryEntryBarCharts = ({
                                           propertyStatistics, dateRange
                                       }: ISelectedHistoryEntryBarChartsProps) => {

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