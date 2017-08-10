const Errors = {
    model: {
        general: {
            requiredProperty: (property) => {
                return `Path \`${property}\` is required.`
            },
            typeCast: (type, value, property) => {
                return `Cast to ${type} failed for value "${value}" at path "${property}"`;
            }
        },
        Message: {
            userId: 'userId must be a valid integer',
            currencyFrom: 'currencyFrom must be a valid currency code',
            currencyTo: 'currencyTo must be a valid currency code',
            amountSell: 'amountSell must be greater than 0',
            amountBuy: 'amountBuy must be greater than 0',
            rate: 'rate must be greater than 0',
            timePlaced: 'timePlaced must be a date in this format: DD-MMM-YY HH:mm:ss',
            originatingCountry: 'originatingCountry must be a valid country code',
            badCountry: 'not a working country'
        }
    }
};

exports.get = (type) => {
    return Errors[type];
};