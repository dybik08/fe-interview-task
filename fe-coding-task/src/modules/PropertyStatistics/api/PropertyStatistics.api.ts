import axios from 'axios'
import { HttpClient } from '../../api'

export interface IPropertyStatisticsApi {
    getPropertyStatistics: (houseType: HouseType[], dateRange: DateRangeApiFormat) => Promise<any>
}

export enum HouseType {
    Boliger = "00",
    Smahus = "02",
    Blokkleiligheter = "03",
}

export type DateRange ={
    from: {
        year: number,
        quarter: 1 | 2 | 3| 4
    }, 
    to: {
        year: number,
        quarter: 1 | 2 | 3| 4
    }
}

export type DateRangeApiFormat = string[]

export class PropertyStatisticsApi implements IPropertyStatisticsApi {
    baseUrl = "https://data.ssb.no/api/v0/no/table/07241"
    // house type, quartal ranges e.g { from: 2020K1, to: 2022K1 }
    
    constructor(private readonly client: HttpClient) {
    }
    
    getPropertyStatistics(houseType: HouseType[], dateRange: DateRangeApiFormat): Promise<any> {
        return this.client.post(this.baseUrl, {
            "query": [
                {
                    "code": "Boligtype",
                    "selection": {
                        "filter": "item",
                        "values": houseType
                    }
                },
                {
                    "code": "ContentsCode",
                    "selection": {
                        "filter": "item",
                        "values": [
                            "KvPris"
                        ]
                    }
                },
                {
                    "code": "Tid",
                    "selection": {
                        "filter": "item",
                        "values": dateRange
                    }
                }
            ],
            "response": {
                "format": "json-stat2"
            }
        })
    }
}