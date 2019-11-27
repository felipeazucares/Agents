/* 
    test case to check that the get function returns
*/
//process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const agents = require('../app_api/controllers/agents.js');
const lists = require('../app_api/controllers/lists.js');
const server = require('../app_api/routes/index.js');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

//console.log(process.env.NODE_ENV);

describe('Agents', () => {
    beforeEach((done) => {
        //don't have anything too do in this case
        done()
    })
    describe('/POST agentSearch', () => {
        it('it should return all the agents ...', (done) => {
            const qry = {
                "name": { "$regex": "Blake" }
            };
            chai.request(server)
                .post('/agents_api/agentsearch')
                .send(qry)
                .end((err, response) => {
                    console.log(response);
                    if (err) {
                        console.error('Error running test');
                        return
                    }
                    response.should.have.status(400)
                    response.body.should.be.a('array')
                    response.body.should.not.be.empty;
                    done()
                })

        });
    })
    describe('/get listfilter', () => {
        it('it should return a list ...', (done) => {
            chai.request(server)
                .get('/listFilter/5dd5797c28cb4c618015aae0/commercial')
                //.send({ "name": { "$regex": "Blake" } })
                .end((err, response) => {
                    console.log(response);
                    if (err) {
                        console.error('Error running test');
                        return
                    }
                    response.should.have.status(200)
                    response.body.should.be.a('array')
                    response.body.should.not.be.empty;

                    done()
                })
        });
    })
})