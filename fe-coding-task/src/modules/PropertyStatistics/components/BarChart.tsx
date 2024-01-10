import { HouseType} from "../api";
import {Bar} from "react-chartjs-2";
import React, {useEffect, useState} from "react";
import {BarChartMapper} from "../mappers";
import {usePropertyStatisticsContext} from "../context";
import {SearchHistoryEntry, useSearchHistory} from "../../SearchHistory";
import {TextareaAutosize} from "@mui/base";

export const BarChartsWrapper = () => {
    const { propertyStatistics } = usePropertyStatisticsContext()
    const {searchHistory, updateHistoryEntry} = useSearchHistory()
    const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<SearchHistoryEntry>()

    const datasetSmahus = propertyStatistics[HouseType.Smahus]
    const datasetBolinger = propertyStatistics[HouseType.Boliger]
    const datasetBlokkleiligheter = propertyStatistics[HouseType.Blokkleiligheter]
    
    const shouldDisplayNotesComponent = datasetSmahus.length > 0 || datasetBolinger.length > 0 || datasetBlokkleiligheter.length > 0
    console.log({shouldDisplayNotesComponent});
    useEffect(() => {
        // latest history entry is current search
        if(shouldDisplayNotesComponent && searchHistory.length > 0) {
            setSelectedHistoryEntry(searchHistory[searchHistory.length - 1])
        }
    }, [shouldDisplayNotesComponent, searchHistory.length])

    const updateHistoryEntryComment = (historyEntry: SearchHistoryEntry, commentText: string) => {
        const updatedEntry = {
            ...historyEntry,
            comment: commentText
        }
        updateHistoryEntry(historyEntry.id, updatedEntry)

        setSelectedHistoryEntry(updatedEntry)
    }
    
    return (
        <>
            {selectedHistoryEntry && <div className="space-y-4 mt-10" >
                <p className="text-xl text-center">Statistics for {selectedHistoryEntry.label}</p>
                <div>
                    <label className="mb-2" htmlFor="notes">Your notes</label>
                    <TextareaAutosize
                        onChange={(event) => updateHistoryEntryComment(selectedHistoryEntry, event.target.value)} value={selectedHistoryEntry.comment || ''}
                        id="notes"
                        className="w-full border-solid border-2 "
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Enter notes about this search..." />
                </div>
            </div>}
            <BarCharts  />
        </>
    )
}

interface IBarChartsProps {}

const BarCharts = ({}: IBarChartsProps) => {

    const {propertyStatistics, formValues} = usePropertyStatisticsContext()

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
    
    const {dateRange} = formValues;
    
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