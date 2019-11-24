/* 
    user controller - handles functinality for user based USE Cases
    Piece and submissions management
*/

"use strict";

const mongoose = require('mongoose');
const schemas = require('../models/schemas');

const defaultUser = {
    firstName: 'Philip',
    lastName: 'Suggars',
    userName: 'felipeazucares',
    password: 'Password1',
    pieces: [{ name: 'Zig-Zag Boy and the Miracle Club' }]
}

function addPiece(req, res) {
    console.log('in addPiece');
    if (!req.body || !req.params.userId) {
        return res
            .status(400)
            .json({ 'message': 'Both piece details and userId are required' })
    }
    const userModel = mongoose.model('User', schemas.userSchema)
    userModel.findById(req.params.userId)
        .select('pieces')
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ 'message': 'Unable to find user' })
            }
            //now insert the piece provided
            user.pieces.push(req.body);
            return user.save()
        })
        .then((err, response) => {
            if (err) {
                return res
                    .status(400)
                    .json({ 'message': err })
            }
            return res
                .status(200)
                .json({
                    'message': 'success',
                    'response': response
                })

        }).catch((err) => {
            return res
                .status(400)
                .json({ 'message': err })
        })
}

function deletePiece(req, res) {
    if (!req.params.pieceId || !req.params.userId) {
        return res
            .status(400)
            .json({ 'message': 'Both pieceId and userId are required' })
    }
    const userModel = mongoose.model('User', schemas.userSchema)
    userModel.findById(req.params.userId)
        .select('pieces')
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ 'message': 'Unable to find user' })
            }
            //now delete the piece provided
            if (!user.pieces.id(req.params.pieceId)) {
                return res
                    .status(400)
                    .json({ 'message': 'Unable to find piece' })
            };
            user.pieces.id(req.params.pieceId).remove();
            return user.save()
                .then((err, response) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({ 'message': err })
                    }
                    return res
                        .status(200)
                        .json({
                            'message': 'success',
                            'response': response
                        })
                    // save catch
                }).catch((err) => {
                    return res
                        .status(400)
                        .json({ 'message': err })
                })
            //findby id catch
        }).catch((err) => {
            return res
                .status(400)
                .json({ 'message': err })
        })
}

function addSubmission(req, res) {
    if (!req.params.agentId || !req.params.userId || !req.params.pieceId) {
        return res
            .status(400)
            .json({ 'message': 'Agent details, userId and pieceId are all required' })
    }
    //first get the agent details
    const agentModel = mongoose.model('Agent', schemas.agentSchema)
    const userModel = mongoose.model('User', schemas.userSchema)
    agentModel.findById(req.params.agentId)
        //.select('name')
        .then((agent) => {
            if (!agent) {
                return res
                    .status(400)
                    .json({ 'message': 'Unable to find agent' })
            }
            req.body.agent = agent
            userModel.findById(req.params.userId)
                .select('pieces')
                .then((user) => {
                    if (!user) {
                        console.error("Unable to find user");
                        return res
                            .status(400)
                            .json({ 'message': 'Unable to find user' })
                    }
                    //now find the piece requried
                    //console.log(user);
                    if (!user.pieces.id(req.params.pieceId)) {
                        return res
                            .status(400)
                            .json({ 'message': 'Unable to find piece' })
                    }
                    //add the submission into the requried piece
                    //console.log(user.pieces.id(req.params.pieceId));
                    const submission = {
                        dateSubbed: req.body.dateSubbed,
                        status: req.body.status,
                        agent: req.body.agent
                    }
                    user.pieces.id(req.params.pieceId).submissions.push(req.body);
                    return user.save()
                        .then((response) => {
                            return res
                                .status(200)
                                .json({
                                    'message': 'success',
                                    'response': response
                                })
                        }).catch((err) => {
                            //getting user catch
                            return res
                                .status(400)
                                .json({ 'message': err })
                        })
                    //save catch
                }).catch((err) => {
                    //getting user catch
                    return res
                        .status(400)
                        .json({ 'message': err })
                })
        })
        .then(() => {
        }).catch((err) => {
            console.error("Problem getting agent data");
            return res
                .status(400)
                .json({ 'message': err })
        })

}

function deleteSubmission(req, res) {
    console.log(req.params);
    if (!req.params.pieceId || !req.params.userId || !req.params.submissionId) {
        return res
            .status(400)
            .json({ 'message': 'SubmissionId, pieceId and userId are required' })
    }
    const userModel = mongoose.model('User', schemas.userSchema)
    userModel.findById(req.params.userId)
        .select('pieces')
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ 'message': 'Unable to find user' })
            }
            //now delete the piece provided
            if (!user.pieces.id(req.params.pieceId)) {
                return res
                    .status(400)
                    .json({ 'message': 'Unable to find piece' })
            };
            console.log(user.pieces.id(req.params.pieceId).submissions.id(req.params.submissionId));
            user.pieces.id(req.params.pieceId).submissions.id(req.params.submissionId).remove();
            return user.save()
                .then((response) => {
                    return res
                        .status(200)
                        .json({
                            'message': 'success',
                            'response': response
                        })
                    // save catch
                }).catch((err) => {
                    console.error("Error saving user")
                    return res
                        .status(400)
                        .json({ 'message': err })
                })
            //findby id catch
        })
        .catch((err) => {
            console.error("Error finding user")
            return res
                .status(400)
                .json({ 'message': err })
        })
}

module.exports = {
    defaultUser,
    addPiece,
    deletePiece,
    addSubmission,
    deleteSubmission
}
