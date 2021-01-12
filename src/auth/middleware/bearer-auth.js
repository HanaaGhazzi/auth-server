'use strict'

let users = require('../models/user-model');


module.exports = (req, res, next) => {

    if (!req.headers.authorization) { next('not LoggedIn!'); return; }

    let authHeader = req.headers.authorization.split(' ');

    if (authHeader[0] != 'Bearer') { next('invalid Header!'); return; }
    let token = authHeader[1];

    users.authenticateToken(token).then((validUser) => {
        console.log("authenticateToken : validUser", validUser)
        req.user = validUser;
        next();
    }).catch((err) => next('Invalid login', err));

};