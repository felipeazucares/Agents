/* 
    test case to check that the get function returns
*/
process.env.NODE_ENV = 'test-db';
'use strict'

const mongoose = require("mongoose");
const schemas = require('../app_api/models/schemas');
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

describe('Agents test Suite', () => {
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
                    response.should.be.json;
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
                    response.should.be.json;
                    done(err)
                })
        });
    })

    describe('/POST agentSearchSave suite:', () => {
        it('it should fail because no parameters...', (done) => {
            chai.request(server)
                .post('/agents_api/agentsearchsave')
                .set('content-type', 'application/json')
                .send()
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.not.be.empty;
                    response.body.message.should.be.equal("Name, query and userId are required")
                    done(err)
                })
        });

        it('it should save commercial agents to a list called "test" ...', (done) => {

            const body = {
                userId: `${config.defaultUserId}`,
                name: "test",
                qry: {
                    details:
                        { $regex: "(?i)commercial" }
                }
            }

            chai.request(server)
                .post('/agents_api/agentsearchsave')
                .set('content-type', 'application/json')
                .send(body)
                .end((err, response) => {
                    //console.log(response.body)
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.not.be.empty;
                    done(err)
                })
        })
    });

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

    describe('/GET Deletelist & DeleteAll suite', function () {
        //before we can test deletion we have to add at least one item in.
        const userModel = mongoose.model('User', schemas.userSchema);
        const listObject = {
            listName: 'testList',
            _id: mongoose.Types.ObjectId(),
            agents: [{
                _id: "00000000000000000000000",
                name: "Test agent"
            }]
        }
        beforeEach(() => {
            // add in list to remove
            userModel.findById(config.defaultUserId)
                .select('agentList')
                .then((parentDoc) => {
                    if (!parentDoc) {
                        console.error('Unable to find user');
                    }
                    parentDoc.agentList.push(listObject)
                    return parentDoc.save()
                }).catch((err) => {
                    // Error occured adding user provided
                    console.error("Error adding user");
                    console.error(err);
                })

        })

        it('it should remove the list testLlist', function (done) {
            //console.log(listObject._id);
            chai.request(server)
                .get(`/agents_api/listDelete/${config.defaultUserId}/${listObject._id}`)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.not.be.empty
                    done()
                })
        });

        it('it should fail if the parameters are missing', function (done) {
            //console.log(listObject._id);
            chai.request(server)
                .get(`/agents_api/listDelete/`)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.body.should.be.empty
                    done()
                })
        });

        it('it should fail if the listId is invalid', function (done) {
            //console.log(listObject._id);
            chai.request(server)
                .get(`/agents_api/listDelete/${config.defaultUserId}/00000000000000000000000`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.message.should.equal('Unable to find listid')
                    done()
                })
        });

        it('it should fail if the userId is invalid', function (done) {
            chai.request(server)
                .get(`/agents_api/listDelete/5dd5797c28cb4c0000000000/${listObject._id}`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.message.should.equal('Unable to find userId')
                    done()
                })
        });

        it('it should remove all the agent lists', function (done) {
            chai.request(server)
                .get(`/agents_api/listDeleteAll/${config.defaultUserId}`)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.response.agentList.should.be.a('array')
                    response.body.response.agentList.should.be.empty
                    done(err)
                })
        });

        it('it should fail if the user is invalid', function (done) {
            chai.request(server)
                .get(`/agents_api/listDeleteAll/5dd5797c28cb4c0000000000`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.message.should.equal('Unable to find userId')
                    done(err)
                })
        });


    })

    /*********************************
    *
    *           ListAddItem
    *
    **********************************/

    describe('/GET listAddItem suite', function () {

        //before we can test deletion we have to add at least one list in.
        const userModel = mongoose.model('User', schemas.userSchema);
        let agentToAddId = {}
        const listObject = {
            listName: 'testList',
            _id: mongoose.Types.ObjectId(),
            agents: [{
                _id: "00000000000000000000000",
                name: "Test agent"
            }]
        }
        const lengthToTestAgainst = listObject.agents.length

        before(() => {
            // add in list to remove
            return new Promise((resolve, reject)=> {
                userModel.findById(config.defaultUserId)
                    .select('agentList')
                    .then((parentDoc) => {
                        if (!parentDoc) {
                            console.error('Unable to find user');
                        }
                        parentDoc.agentList.push(listObject)
                        return parentDoc.save()
                    })
                    .then(async () => {
                        const agentModel = mongoose.model('Agent', schemas.agentSchema);
                        return agentModel.find({})
                    })
                    .then((response) => {
                        //get first record from list
                        agentToAddId = response[0]._id
                        console.log(response[0]._id);
                        resolve(response[0]._id)
                    }).catch((err) => {
                        console.error(err)
                        reject(err)
                    })
            })

    })

    //get the first agents details

    it('should add a new item into the testList', (done) => {
        chai.request(server)
            .get(`/agents_api/listAddItem/${config.defaultUserId}/${listObject._id}/${agentToAddId}`)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.agentList.testList.should.not.be.equal(lengthToTestAgainst + 1)
                done(err)
            })

    })
})

    /* other ones to test
    done - agentListFilter,
    done - agentListDelete,
    done - agentListDeleteAll
    agentListAddItem,
    agentListDeleteItem
    */

})