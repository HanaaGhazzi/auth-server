'use strict';
require('dotenv').config();
const superagent = require('superagent');
const users = require('../models/user-model.js');
const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

module.exports = async (req, res, next) => {
  try {
    const code = req.query.code;

    const remoteToken = await exchangeCodeForToken(code);
    console.log('remote Token ->' , remoteToken)
    const remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('remote user ->' , remoteUser)
    const [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code', 
  });
  const access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(remoteAPI)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'oAuth-App');
  const user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  const userRecord = {
    username: remoteUser.login,
    password: 'anything', 
  };
  const user = await users.save(userRecord);
  
  const token = users.generateToken(user);
  return [user, token];
}