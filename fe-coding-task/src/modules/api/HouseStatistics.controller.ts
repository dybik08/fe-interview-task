import {useQuery} from "react-query";
import { DateRangeApiFormat, HouseStatisticsApi, HouseType } from "./HouseStatistics.api";

export const houseStatisticsListQueryKey = (numberOfQuarters: number) => ["houseStatisticsApi.getHouseStatistics", numberOfQuarters]

export const useListHouseStatistics = (houseType: HouseType[], dateRange: DateRangeApiFormat) => {
    const houseStatisticsApi = new HouseStatisticsApi()
    const { data: houseStatistics = [], isLoading: loading, error } = useQuery<any, Error>(houseStatisticsListQueryKey(dateRange.length), async () => {
            try {
                return await houseStatisticsApi.getHouseStatistics(houseType, dateRange).then(list => list)
            } catch (error) {
                throw new Error("Could not load house statistics: ")
            }
        },
        { refetchOnWindowFocus: false, staleTime: 10000}
    )
    
    return {
        houseStatistics,
        loading,
        error
    }
}