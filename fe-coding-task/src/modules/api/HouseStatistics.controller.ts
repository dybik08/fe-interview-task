import {useQuery} from "react-query";
import { DateRangeApiFormat, HouseStatisticsApi, HouseType } from "./HouseStatistics.api";

export const houseStatisticsListQueryKey = (numberOfQuarters: number, houseTypeKey: string) => ["houseStatisticsApi.getHouseStatistics", numberOfQuarters, houseTypeKey]

const getHouseTypesKey = (houseType: HouseType[]): string => {
    return houseType.reduce((acc, curr) => {
        return acc + curr
    }, "")
}

type HouseStatisticsReadModel = Record<HouseType, number[]>

type HouseStatisticsDto = {
    data: {
        value: number[]
    }
}

const defaultValue: HouseStatisticsReadModel = {
    [HouseType.Boliger]: [],
    [HouseType.Blokkleiligheter]: [],
    [HouseType.Smahus]: [],
}

const mapDtoToReadModel = (dto: HouseStatisticsDto, houseTypes: HouseType[], dateRange: DateRangeApiFormat): HouseStatisticsReadModel => {
    const dataSet = dto.data.value;

    return houseTypes.reduce((acc, curr, index) => {
        const sliceParams = {
            from: index === 0 ? 0 : (index * dateRange.length) ,
            to: index === 0 ? dateRange.length : (index * dateRange.length) + dateRange.length,
            curr
        }
        acc[curr] = dataSet.slice(sliceParams.from, sliceParams.to)
        return acc
    }, defaultValue)
}

export const useListHouseStatistics = (houseType: HouseType[], dateRange: DateRangeApiFormat) => {
    const houseStatisticsApi = new HouseStatisticsApi()
    
    const { data: houseStatistics = defaultValue, isLoading: loading, error } = useQuery<HouseStatisticsReadModel, Error>(houseStatisticsListQueryKey(dateRange.length, getHouseTypesKey(houseType)), async () => {
            try {
                return await houseStatisticsApi.getHouseStatistics(houseType, dateRange).then(dto => {
                    return mapDtoToReadModel(dto, houseType, dateRange)
                })
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