export const validateToYear = (yearFrom: number) => {
    const currentYear = new Date(Date.now()).getFullYear()
    return yearFrom > currentYear ? currentYear : yearFrom
}