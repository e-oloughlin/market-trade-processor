const Errors = {
    model: {
        general: {
            requiredProperty: (property) => {
                return `Path \`${property}\` is required.`
            }
        },
        Message: {
            userId: 'userId must be a valid integer',
            currencyFrom: 'currencyFrom must be a valid currency code',
            currencyTo: 'currencyTo must be a valid currency code',
            originatingCountry: 'originatingCountry must be a valid country code'
        }
    }
};

exports.get = (type) => {
    return Errors[type];
};