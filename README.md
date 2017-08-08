# Market Trade Processor - Sample Application
A sample application demomstrating a REST API and live updating socket.io front end.

## Demo
A live API can be viewed and _interacted with_ [here](https://market-trader.herokuapp.com/api/message) with a corresponding front end [here](https://market-trader.herokuapp.com/).

## Tests
Mocha tests can be run with ```npm run test```

## Running locally
##### Mongodb
A local installation of **Monogodb** needs to be installed and running.
##### Dependencies
Dependencies can be installed with ```npm install``` and ```bower install```
##### Starting the app
```npm run start``` or ```npm run dev``` for a live reloading server which listens for file changes.

### Message Object
Message objects can be posted and read from the api in the following format:
```
{
    userId: 134256,
    currencyFrom: 'EUR',
    currencyTo: 'GBP',
    amountSell: 1000,
    amountBuy: 747.10,
    rate: 0.7471,
    timePlaced: '24-JAN-15 10:27:44',
    originatingCountry: 'FR'
}
```
#### API Overview

Method  | URI                    | Function
------- | ---------------------- | --------
GET     | ```/api/message```     | Retrieve all messages
GET     | ```/api/message/:id``` | Retrieve a single message by its id
POST    | ```/api/message```     | Create a new message
PUT     | ```/api/message/:id``` | Update the properties of a message
DELETE  | ```/api/message/:id``` | Delete a message