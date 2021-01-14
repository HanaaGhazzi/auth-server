'use strict';

const users = require('../models/user-model');


module.exports = (capability) => {//when the middleware has an arg
  return (req, res, next) => {
    // we are expecting the bearerAuth middleware to add the user on the req
    // we need to find the user capabilities
    // req.user.capabilities = Array of capabilities regarding the role
    return users.can(req.user.capabilities.includes(capability)).then(result =>{
        result ?  next() : next('Access Denied!');
      }).catch(e =>{next('Invalid Login');
      });
    };
};