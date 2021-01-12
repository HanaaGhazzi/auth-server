'use strict';

const superagent = require('superagent');
const users = require('../models/user-model');
// 2. Users are redirected back to your site by GitHub
// POST https://github.com/login/oauth/access_token
const tokenUrl = 'https://github.com/login/oauth/access_token';
const userUrl = 'https://api.github.com/user';
// add it in .env
const CLIENT_ID = process.env.CLIENT_ID;
// add it in .env
const SECRET_ID = process.env.SECRET_ID;
const API_SERVER = process.env.API_SERVER;

module.exports = async function(req, res, next) {
    // 1. get the code from the query 
    let code = req.query.code; // form code
    console.log('(1) CODE ====== ', code);
    // 2. get token 
    let remoteToken = await exchangeCodeWithToken(code);
    console.log('(2) remoteToken =====> ', remoteToken);
    // 3. get user object by the token
    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log("(3) remoteUser.login-----> ", remoteUser.login);

    let [localUser, localToken] = await getUser(remoteUser); 
    console.log("(4) localUser -----> ", localUser, " localToken ===> ", localToken);
    req.user = localUser;
    req.token = localToken;
    next();
}

async function exchangeCodeWithToken(code) {
    // tokenUrl
    let tokenResponse = await superagent.post(tokenUrl).send({
        code : code, 
        client_id: CLIENT_ID,
        client_secret : SECRET_ID,
        redirect_uri: API_SERVER
    });
    return tokenResponse.body.access_token;
}

async function getRemoteUserInfo(token) {
    let userResponse = await superagent.get(userUrl)
        .set('Authorization', `token ${token}`)
        .set('user-agent', 'oAuth-App');
    let user = userResponse.body;
    return user;
}

async function getUser(userObj) {
    let userRecord = {
        username: userObj.login,
        password: 'ouathpass'
    };
    let user = await users.save(userRecord);
    let token = await users.generateToken(user);
    return [user, token];
}