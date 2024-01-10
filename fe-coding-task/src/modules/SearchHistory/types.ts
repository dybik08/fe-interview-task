import {HouseStatisticsReadModel} from "../PropertyStatistics";

export type SearchHistoryEntryId = string & {readonly  __type: unique symbol}

export type SearchHistoryEntry = {
    comment: string | null,
    searchData: HouseStatisticsReadModel,
    label: string,
    dateRange: string[]
    id: SearchHistoryEntryId
}