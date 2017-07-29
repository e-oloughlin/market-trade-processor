let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let api = require('../app').api;

chai.use(chaiHttp);