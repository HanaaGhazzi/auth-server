'use strict'

const base64 = require('base-64');
const users = require('../models/user-model');



module.exports = (req, res, next) => {
  // check if the client sent authorization headers
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
  
    const basic = req.headers.authorization.split(' ').pop(); 
    // console.log('BASIC : ', basic);
    const [user, pass] = base64.decode(basic).split(':'); 
    console.log('__BASIC_AUTH__', user, pass);
    users
      .authenticateBasic(user, pass)
      .then((validUser) => {
        // console.log('req.TOKEN :', req.token);
        req.token = users.generateToken(validUser);
        req.user = validUser;

        next();
      })
      .catch((err) => next(err));
  }
};