export const validateQuarter = (toYear:number, quarter: number): 1 | 2 | 3 | 4 => {
    const currentYear = new Date(Date.now()).getFullYear()
    
    if(currentYear === toYear) {
        // quarter cannot be higher than 2023K3
        if(quarter > 3){
            return 3
        }
    }

    // quarter cannot be higher than 4
    if(quarter > 4) return 4
    
    // quarter cannot be less or equal than 0
    if(quarter <= 0) {
        return 1
    }
    
    return (quarter as 1 | 2 | 3 | 4) 
}

// const quarterOfYear = (date = new Date()) => Math.ceil((date.getMonth() + 1) / 3)