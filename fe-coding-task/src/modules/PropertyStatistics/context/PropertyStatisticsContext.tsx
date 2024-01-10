import {
    DateRangeApiFormat,
    HouseStatisticsReadModel,
    HouseType,
    useListPropertyStatistics
} from "../api";
import React, {createContext, PropsWithChildren, useContext, useState} from "react";
import {PropertyTypeMapper} from "../mappers";
import { v4 as uuidv4 } from 'uuid';
import { SearchHistoryEntryId, useSearchHistory} from "../../SearchHistory";

interface FormValues {
    houseType: HouseType[]
    dateRange: DateRangeApiFormat
}

interface IPropertyStatisticsContext {
    setFormSubmitted: () => void
    setFormValues: ({
                        houseType,
                        dateRange,
                    }: {
        houseType: HouseType[]
        dateRange: DateRangeApiFormat,
    }) => void
    formValues: FormValues
    propertyStatistics: HouseStatisticsReadModel
}

const PropertyStatisticsContext = createContext<Partial<IPropertyStatisticsContext>>({})

export const PropertyStatisticsContextProvider = ({children}: PropsWithChildren<{}>) => {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [formValues, setFormValues] = useState<FormValues>({
        dateRange: [],
        houseType: [],
    })
    
    const { addEntryToHistoryEntries } = useSearchHistory()

    const baz = {
        enabled: formSubmitted,
        dateRange: formValues.dateRange,
        houseType: formValues.houseType,
        onSuccess: (dateRange: DateRangeApiFormat , houseType: HouseType[], searchData: HouseStatisticsReadModel) => {
            setFormSubmitted(false)

            const newEntry = {
                id: uuidv4() as SearchHistoryEntryId,
                comment: null,
                dateRange,
                searchData,
                label: `${houseType.reduce((previousValue, currentValue, index) => {
                    let label = ''
                    if(index === 0){
                        label =`${PropertyTypeMapper.mapPropertyTypeToString(currentValue)} `
                    } else {
                        label =`${previousValue} and ${PropertyTypeMapper.mapPropertyTypeToString(currentValue)} `
                    }

                    if(index === houseType.length - 1) {
                        label = label + `from ${dateRange[0]} to ${dateRange[dateRange.length - 1]}`
                    }

                    return label
                }, '')}`
            }
            
            addEntryToHistoryEntries(newEntry)
        }
    }

    const {propertyStatistics} = useListPropertyStatistics(baz)

    const ctx: IPropertyStatisticsContext = {
        setFormSubmitted: () => setFormSubmitted(true),
        setFormValues: ({
                            houseType,
                            dateRange,
                        }) => {
            setFormValues({
                houseType,
                dateRange,
            })
        },
        formValues,
        propertyStatistics,
    }

    return (
        <PropertyStatisticsContext.Provider value={ctx}>
            {children}
        </PropertyStatisticsContext.Provider>
    )
}

export const usePropertyStatisticsContext = (): IPropertyStatisticsContext => {
    const {setFormValues, setFormSubmitted, formValues, propertyStatistics} = useContext(PropertyStatisticsContext);

    if(!setFormValues) throw new Error("IPropertyStatisticsContext.setFormValues is not defined")
    if(!setFormSubmitted) throw new Error("IPropertyStatisticsContext.setFormSubmitted is not defined")
    if(!formValues) throw new Error("IPropertyStatisticsContext.formValues is not defined")
    if(!propertyStatistics) throw new Error("IPropertyStatisticsContext.propertyStatistics is not defined")
    
    return {setFormValues, setFormSubmitted, formValues, propertyStatistics}
}