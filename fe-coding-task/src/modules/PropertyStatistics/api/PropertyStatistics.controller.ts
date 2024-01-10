import {useQuery  } from "react-query";
import { useApi } from "../../api/Api.context";
import { DateRangeApiFormat, HouseType } from "./PropertyStatistics.api";

export const houseStatisticsListQueryKey = (numberOfQuarters: number, houseTypeKey: string) => ["houseStatisticsApi.getHouseStatistics", numberOfQuarters, houseTypeKey]

const getHouseTypesKey = (houseType: HouseType[]): string => {
    return houseType.reduce((acc, curr) => {
        return acc + curr
    }, "")
}

export type HouseStatisticsReadModel = Record<HouseType, number[]>

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

interface IUseListPropertyStatistics {
    houseType: HouseType[]
    dateRange: DateRangeApiFormat,
    enabled: boolean,
    onSuccess: (dateRange: DateRangeApiFormat , houseType: HouseType[], searchData: HouseStatisticsReadModel) => void
}

export const useListPropertyStatistics = ({dateRange, houseType, enabled = false, onSuccess}: IUseListPropertyStatistics) => {
    const {propertyStatisticsApi} = useApi()

    const defaultValues = {
        dateRange: dateRange || [],
        houseType: houseType || []
    }

    const { data: propertyStatistics = defaultValue, isLoading: loading, error } = useQuery<HouseStatisticsReadModel, Error>(houseStatisticsListQueryKey(defaultValues.dateRange.length, getHouseTypesKey(defaultValues.houseType)),  async () => {
            try {
                return await propertyStatisticsApi.getPropertyStatistics(defaultValues.houseType, defaultValues.dateRange || []).then(dto => {
                    return mapDtoToReadModel(dto, defaultValues.houseType, defaultValues.dateRange)
                })
            } catch (error) {
                throw new Error("Could not load house statistics: ")
            }
        },
        { 
            refetchOnWindowFocus: false, staleTime: 10000, enabled: enabled, 
            onSuccess: (data) => {
                onSuccess(
                    dateRange, houseType, data
                )
            }
        }
    )
    
    return {
        propertyStatistics,
        loading,
        error,
    }
}
