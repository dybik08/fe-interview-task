import {HouseType} from "../../api/HouseStatistics.api";
import {PropertyTypeMapper} from "./propertyType.mapper";


export class BarChartMapper {
    constructor(private readonly labels: string[], private readonly dateRange: string[]) {}
    
    mapDataSetToChartData = (dataset: number[] ,houseType: HouseType) => {
        return {
            labels: this.labels,
            datasets: [
                {
                    label: PropertyTypeMapper.mapPropertyTypeToString(houseType),
                    data: this.dateRange.map((_, index) => {
                        return dataset[index]
                    }),
                    backgroundColor: BarChartMapper.mapHouseTypeToChartBackgroundColor(houseType),
                },
            ],
        }
    }
    
    static mapHouseTypeToChartBackgroundColor = (houseType: HouseType) => {
        if(HouseType.Smahus === houseType) return 'rgba(26, 179, 37, 0.8)'
        if(HouseType.Boliger === houseType) return '#eb4934'

        return '#3440eb'
    }
}