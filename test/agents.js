/* 
    test case to check that the get function returns
*/
//process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const agents = require('../app_api/controllers/agents.js');
const lists = require('../app_api/controllers/lists.js');
const server = require('../app.js');
const assert = require('assert')
const config = require('config')

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Agents API test Suite', () => {
    beforeEach(() => {
        //don't have anything too do in this case
    })
    describe('/POST agentSearch suite:', () => {
        it('it should return No query error ...', (done) => {
            //const qry = {}
            chai.request(server)
                .post('/agents_api/agentsearch')
                .set('content-type', 'application/json')
                .send()
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.not.be.empty;
                    response.body.message.should.be.equal("No query provided")
                    done(err)
                })
        });


        it('it should return all agents ...', (done) => {
            const qry = { qry: {} }
            chai.request(server)
                .post('/agents_api/agentsearch')
                .set('content-type', 'application/json')
                .send(qry)
                .end((err, response) => {
                    //console.log(response.body)
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.not.be.empty;
                    done(err)
                })
        });
    })


    describe('/GET listfilter suite', () => {
        it('it should fail if filter & user missing ...', (done) => {
            chai.request(server)
                .get(`/agents_api/listFilter`)
                .end((err, response) => {
                    //console.log(response)
                    response.should.have.status(404)
                    response.body.should.be.empty
                    done()
                })
        });

        it('it should fail if filter missing ...', (done) => {
            chai.request(server)
                .get(`/agents_api/listFilter/${config.defaultUserId}`)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.body.should.be.empty
                    done()
                })
        });

        it('it should fail if user not found ...', (done) => {
            chai.request(server)
                .get(`/agents_api/listFilter/000000000000000000000000/thriller`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.empty
                    done()
                })
        });

        it('it should function with both parameters ...', (done) => {
            chai.request(server)
                .get(`/agents_api/listFilter/${config.defaultUserId}/thriller`)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.not.be.empty
                    done()
                })
        });

    });


})