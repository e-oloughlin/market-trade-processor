let config = {
    development: {
        database: process.env.MONGODB_URI || 'mongodb://127.0.01/market-trade-db'
    },
    test: {
        database: 'mongodb://127.0.01/market-trade-test-db'
    }
};

exports.get = (env) => {
    return config[env] || config.development;
};