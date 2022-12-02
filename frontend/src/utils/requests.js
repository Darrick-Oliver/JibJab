export const makePostRequest = (url, body, headers) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res) {
                    reject({
                        error: true,
                        errorMessage: 'An unexpected error occurred',
                        data: null,
                    });
                } else if (res.error) {
                    reject(res);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                reject({
                    error: true,
                    errorMessage: 'Unable to reach server',
                    data: null,
                });
            });
    });
};

export const makeGetRequest = (url, headers) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res) {
                    reject({
                        error: true,
                        errorMessage: 'An unexpected error occurred',
                        data: null,
                    });
                } else if (res.error) {
                    reject(res);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                reject({
                    error: true,
                    errorMessage: 'Unable to reach server',
                    data: null,
                });
            });
    });
};

export const makeDeleteRequest = (url, headers) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res) {
                    reject({
                        error: true,
                        errorMessage: 'An unexpected error occurred',
                        data: null,
                    });
                } else if (res.error) {
                    reject(res);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                reject({
                    error: true,
                    errorMessage: 'Unable to reach server',
                    data: null,
                });
            });
    });
};
