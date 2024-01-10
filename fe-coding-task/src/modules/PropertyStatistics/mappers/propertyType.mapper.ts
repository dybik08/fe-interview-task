import {HouseType} from "../api";

export class PropertyTypeMapper {
    static mapPropertyTypeToString = (houseType: HouseType) => {
        if(HouseType.Smahus === houseType) return "Smahus"
        if(HouseType.Boliger === houseType) return "Boliger"

        return "Blokkleiligheter"
    }
    
    static mapSearchParamToPropertyType = (propertyTypeSearchParam: string): HouseType[] => {
        const houseTypes = propertyTypeSearchParam.split(',')

        return houseTypes.map(houseType => {
            if("Småhus" === houseType) return HouseType.Smahus
            if("Boliger-i-alt" === houseType) return HouseType.Boliger

            return HouseType.Blokkleiligheter
        })
    }
    
    static mapFormValueToPropertyType = (propertyTypeFormValue?: string[]): HouseType[] => {
        if(!propertyTypeFormValue) { 
            return []
        }
        
        return propertyTypeFormValue.map(houseType => {
            if("Småhus" === houseType) return HouseType.Smahus
            if("Boliger-i-alt" === houseType) return HouseType.Boliger

            return HouseType.Blokkleiligheter
        })
    }
}