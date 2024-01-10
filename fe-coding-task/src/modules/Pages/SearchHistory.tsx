import React, {useState} from "react";
import {TextareaAutosize} from '@mui/base';
import {SearchHistoryEntry, SearchHistoryList, SelectedHistoryEntryBarCharts, useSearchHistory} from "../SearchHistory";
import {PageLayout} from "../app";

export const SearchHistoryPage = () => {
    const {searchHistory, updateHistoryEntry} = useSearchHistory()
    const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<SearchHistoryEntry>()
    
    const updateHistoryEntryComment = (historyEntry: SearchHistoryEntry, commentText: string) => {
        const updatedEntry = {
            ...historyEntry,
            comment: commentText
        }
        updateHistoryEntry(historyEntry.id, updatedEntry)

        setSelectedHistoryEntry(updatedEntry)
    }

    return (
        <PageLayout pageTitle="Search History" >
            <div className="mt-10 flex space-x-6">
                <div>
                    <SearchHistoryList searchHistory={searchHistory}
                                       setSelectedHistoryEntry={(historyEntry: SearchHistoryEntry) => setSelectedHistoryEntry(historyEntry)}/>
                </div>
                <div>
                    {selectedHistoryEntry && <div className="space-y-4">
                        <p className="text-xl text-center">Selected entry: </p>
                        <p className="text-lg">{selectedHistoryEntry.label}</p>
                        <div>
                            <label className="mb-2" htmlFor="notes">Your notes</label>
                            <TextareaAutosize
                                onChange={(event) => updateHistoryEntryComment(selectedHistoryEntry, event.target.value)}
                                value={selectedHistoryEntry.comment || ''}
                                id="notes"
                                className="w-full border-solid border-2 "
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="Enter notes about this search..."/>
                        </div>
                    </div>}
                    {selectedHistoryEntry && <SelectedHistoryEntryBarCharts dateRange={selectedHistoryEntry.dateRange}
                                                                            propertyStatistics={selectedHistoryEntry.searchData}/>}
                </div>
            </div>
        </PageLayout>
    )
}
