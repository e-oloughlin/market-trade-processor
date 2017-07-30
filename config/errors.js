const Errors = {
    model: {
        Message: {
            currencyFrom: 'currencyFrom must be a valid currency code',
            currencyTo: 'currencyTo must be a valid currency code'
        }
    }
};

exports.get = (type) => {
    return Errors[type];
};