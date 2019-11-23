/* 
    user controller
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


module.exports = {
    defaultUser,
    addPiece,
    deletePiece
}
