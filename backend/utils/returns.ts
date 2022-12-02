import { isValidObjectId } from 'mongoose';

export const successMessage = (data?: string | {}) => {
    return toObject({
        error: false,
        errorMessage: null,
        data: data,
    });
};

// Convert objectIds to strings
const toObject = (data: object) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            isValidObjectId(value) ? value.toString() : value
        )
    );
};

export const errorMessage = (message: string) => {
    return {
        error: true,
        errorMessage: message,
        data: null,
    };
};
