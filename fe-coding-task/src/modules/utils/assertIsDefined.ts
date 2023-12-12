export function assertIsDefined<T>(arg: T | null | undefined, errorMessage: string) {
    if(arg !== undefined && arg !== null) return;

    throw new Error(errorMessage)
}