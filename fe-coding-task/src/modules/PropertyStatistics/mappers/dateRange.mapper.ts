import {DateRange, DateRangeApiFormat} from "../api";
import {validateFromYear, validateQuarter, validateToYear} from "../../utils";

export class DateRangeMapper {
    static mapDateRangeToQuarterList(dateRange: DateRange): DateRangeApiFormat {
        // starting year, starting quarter, fill with quarters to end year, end quarter
        const startingYear = dateRange.from.year
        const endingYear = dateRange.to.year
        const startingQuarter = dateRange.from.quarter
        const endingQuarter = dateRange.to.quarter

        const result = []

        const pickEndingQuarter = (year: number) => {
            if(year === endingYear) {
                return endingQuarter
            }

            return 4
        }

        for (let year = startingYear; year <= endingYear; year++) {
            for (let quarter = startingQuarter; quarter <= pickEndingQuarter(year); quarter++) {
                const correctFormat = `${year}K${quarter}`;
                result.push(correctFormat)
            }
        }

        return result
    }
    
    // dodać statyczną metodę na mapowanie DateRangeApiFormat -> DateRange

    static mapFormValuesToQueryParams(dateRange: DateRange, propertyType: string[]) {
        return {
            from: `${dateRange.from.year}K${dateRange.from.quarter}`,
            to: `${dateRange.to.year}K${dateRange.to.quarter}`,
            propertyType: propertyType.reduce((acc, curr, index) => {
                const shouldAddComa = index > 0;
              return `${acc}${shouldAddComa ? "," : ''}${curr}`  
            },"")
        }
    }

    static mapQueryParamsToFormValues(from: string, to: string): DateRange {
        const foo = from.split("K")
        const baz = to.split("K")

        const fromYear = validateFromYear(parseInt(foo[0]))
        const toYear = validateToYear(parseInt(baz[0]))
        const fromYearQuarter  = validateQuarter(fromYear, parseInt(foo[1]))
        const toYearQuarter = validateQuarter(toYear, parseInt(baz[1]))

        return {
            from: {
                year: fromYear,
                quarter: fromYearQuarter
            },
            to: {
                year: toYear,
                quarter: toYearQuarter
            }
        }
    }
}