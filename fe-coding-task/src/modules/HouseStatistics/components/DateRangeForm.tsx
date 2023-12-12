import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useSearchParams} from "react-router-dom";
import { validateFromYear } from "../../utils";
import { DateRangeMapper } from "../mappers";

type Inputs = {
    from: string
    quarterFrom: 1 | 2 | 3 | 4
    to: string
    quarterTo: 1 | 2 | 3 | 4
}

export const DateRangeForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitSuccessful },
    } = useForm<Inputs>()

    const [searchParams, setSearchParams] = useSearchParams();

    const from = searchParams.get("from")
    const to = searchParams.get("to")
    
   
    const setFormValuesFromQueryParams = (from: string, to: string) => {
        const formValues = DateRangeMapper.mapQueryParamsToFormValues(from, to)
        const yearFrom = validateFromYear(formValues.from.year)

        setValue('from', yearFrom.toString())
        setValue('quarterFrom', formValues.from.quarter)
        setValue('to', formValues.to.year.toString())
        setValue('quarterTo', formValues.to.quarter)
    }
    
    // check if there are query params e.g from pasted url
    if(from && to) {
        setFormValuesFromQueryParams(from, to)
    } else {
        // check local storage if there are any values
        const from = localStorage.getItem("from");
        const to = localStorage.getItem("to")
        
        if(from && to) {
            setFormValuesFromQueryParams(from, to)
        }
    }

     const onSubmit: SubmitHandler<Inputs> = (data) => {
        setSearchParams(prev => {
            const queryParams = DateRangeMapper.mapFormValuesToQueryParams({
                from: {
                    year: parseInt(data.from),
                    quarter: data.quarterFrom
                },
                to: {
                    year: parseInt(data.to),
                    quarter: data.quarterTo
                }
            })

            localStorage.setItem("from", queryParams.from);
            localStorage.setItem("to", queryParams.to);

            return queryParams
        })
    }

    return (
        <form className="flex flex-col w-96" onSubmit={handleSubmit(onSubmit)}>
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
            <div className="mt-6 flex justify-end" >
                <input className="items-start" type="submit"/>
            </div>
        </form>
    )
}