const Errors = {
    model: {
        Message: {
            userId: 'userId must be a valid integer',
            currencyFrom: 'currencyFrom must be a valid currency code',
            currencyTo: 'currencyTo must be a valid currency code'
        }
    }
};

exports.get = (type) => {
    return Errors[type];
};