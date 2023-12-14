import {useSearchParams} from "react-router-dom";

export const usePropertyStatisticsSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const propertyTypeSearchParam = searchParams.get("propertyType")

    return {
        from,
        to,
        propertyTypeSearchParam,
        setSearchParams
    }
}