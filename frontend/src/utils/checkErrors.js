export const invalidUserChecker = (err) => {
    if (err === 'Invalid user token') return true;
    else return false;
};
