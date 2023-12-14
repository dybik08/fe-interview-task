import {useQuery} from "react-query";
import { useApi } from "../../api/Api.context";
import { DateRangeApiFormat, HouseType } from "./PropertyStatistics.api";

export const houseStatisticsListQueryKey = (numberOfQuarters: number, houseTypeKey: string) => ["houseStatisticsApi.getHouseStatistics", numberOfQuarters, houseTypeKey]

const getHouseTypesKey = (houseType: HouseType[]): string => {
    return houseType.reduce((acc, curr) => {
        return acc + curr
    }, "")
}

type HouseStatisticsReadModel = Record<HouseType, number[]>

type HouseStatisticsDto = {
    value: number[]
}

const defaultValue: HouseStatisticsReadModel = {
    [HouseType.Boliger]: [],
    [HouseType.Blokkleiligheter]: [],
    [HouseType.Smahus]: [],
}

const mapDtoToReadModel = (dto: HouseStatisticsDto, houseTypes: HouseType[], dateRange: DateRangeApiFormat): HouseStatisticsReadModel => {
    const dataSet = dto.value;

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

export const useListPropertyStatistics = (houseType: HouseType[], dateRange: DateRangeApiFormat) => {
    const {propertyStatisticsApi} = useApi()
    
    const { data: propertyStatistics = defaultValue, isLoading: loading, error } = useQuery<HouseStatisticsReadModel, Error>(houseStatisticsListQueryKey(dateRange.length, getHouseTypesKey(houseType)),  async () => {
            try {
                return await propertyStatisticsApi.getPropertyStatistics(houseType, dateRange).then(dto => {
                    return mapDtoToReadModel(dto, houseType, dateRange)
                })
            } catch (error) {
                throw new Error("Could not load house statistics: ")
            }
        },
        { refetchOnWindowFocus: false, staleTime: 10000}
    )
    
    return {
        propertyStatistics,
        loading,
        error
    }
}