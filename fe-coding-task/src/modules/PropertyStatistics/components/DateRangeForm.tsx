import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import { validateFromYear } from "../../utils";
import {DateRangeMapper, PropertyTypeMapper} from "../mappers";
import {usePropertyStatisticsSearchParams} from "../hooks";
import {usePropertyStatisticsContext} from "../context";

type DateRangeFormInputs = {
    from: string
    quarterFrom: 1 | 2 | 3 | 4
    to: string
    quarterTo: 1 | 2 | 3 | 4
    propertyType: string[]
}

const useDateRangeForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitSuccessful, isSubmitted }
    } = useForm<DateRangeFormInputs>()
    
    const {setFormValues, setFormSubmitted} = usePropertyStatisticsContext()

    const {setSearchParams, propertyTypeSearchParam, from, to} = usePropertyStatisticsSearchParams()

    const setFormValuesFromQueryParams = (from: string, to: string, propertyType: string) => {
        const propertyTypes = propertyType.split(',')
        const formValues = DateRangeMapper.mapQueryParamsToFormValues(from, to)
        const yearFrom = validateFromYear(formValues.from.year)

        setValue('from', yearFrom.toString())
        setValue('quarterFrom', formValues.from.quarter)
        setValue('to', formValues.to.year.toString())
        setValue('quarterTo', formValues.to.quarter)
        setValue('propertyType', propertyTypes)
    }

    // check if there are query params e.g from pasted url
    if(from && to && propertyTypeSearchParam) {
        setFormValuesFromQueryParams(from, to, propertyTypeSearchParam)
    } else {
        // check local storage if there are any values
        const from = localStorage.getItem("from");
        const to = localStorage.getItem("to")
        const propertyType = localStorage.getItem("propertyType")

        if(from && to && propertyType) {
            setFormValuesFromQueryParams(from, to, propertyType)
        }
    }

    const onSubmit: SubmitHandler<DateRangeFormInputs> = (data) => {
        const dateRange = {
            from: {
                year: parseInt(data.from),
                quarter: data.quarterFrom
            },
            to: {
                year: parseInt(data.to),
                quarter: data.quarterTo
            },
        }

        const queryParams = DateRangeMapper.mapFormValuesToQueryParams(dateRange, data.propertyType)
        
        setSearchParams(prev => {
            

            localStorage.setItem("from", queryParams.from);
            localStorage.setItem("to", queryParams.to);
            localStorage.setItem("propertyType", queryParams.propertyType);
            
            return queryParams
        })
        
        const dateRangeS = DateRangeMapper.mapDateRangeToQuarterList(dateRange)
 
        setFormValues({
            dateRange: dateRangeS,
            houseType: PropertyTypeMapper.mapFormValueToPropertyType(data.propertyType)
        })
        setFormSubmitted()
    }
    
    return {
        handleSubmit,
        onSubmit,
        register
    }
}

export const DateRangeForm = () => {
    const {
        handleSubmit,
        onSubmit, register
    } = useDateRangeForm()

    return (
        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex space-x-6">
                <label className="inline-block pr-6 w-40" htmlFor="year-start" >Year from:</label>
                <input id="year-start" type="number" min="2009" max="2023" step="1" defaultValue="2016" {...register("from")}  />
                <label className="pr-6" htmlFor="year-start-quarter" >Quarter:</label>
                <input id="year-start-quarter" type="number" min="1" max="4" step="1" defaultValue="1" {...register("quarterFrom")}  />
            </div>
            <div className="flex space-x-6" >
                <label className="inline-block w-40 pr-6" htmlFor="year-end" >Year to:</label>
                <input id="year-end" type="number" min="2009" max="2023" step="1" defaultValue="2016" {...register("to")}  />
                <label className="pr-6" htmlFor="year-end" >Quarter:</label>
                <input id="year-end-quarter" type="number" min="1" max="4" step="1" defaultValue="1" {...register("quarterTo")}  />
            </div>
            <div className="mt-6 space-x-6" >
                <label htmlFor="property-type">Choose a type of property:</label>
                <select multiple {...register("propertyType")}    >
                    <option value="Småhus">Småhus</option>
                    <option value="Blokkleiligheter">Blokkleiligheter</option>
                    <option value="Boliger-i-alt">Boliger i alt</option>
                </select>
            </div>
            <div className="mt-6 flex justify-end" >
                <input className="items-start" type="submit"/>
            </div>
        </form>
    )
}