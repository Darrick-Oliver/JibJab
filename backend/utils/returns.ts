export const successMessage = (data?: string | {}) => {
    return {
        error: false,
        errorMessage: null,
        data: data
    }
}

export const errorMessage = (message: string) => {
    return {
        error: true,
        errorMessage: message,
        data: null
    }
}