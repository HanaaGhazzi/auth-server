'use strict';
const express = require('express');
const router = express.Router();
const users = require('./models/user-model');
const basicAuth = require('./middleware/basic');


router.post('/signup', signupHandler);
router.post('/signin', basicAuth ,signinHandler);
router.get('/users', basicAuth ,usersHandler);


function signupHandler(req, res) {
  users.save(req.body).then((userData) =>{
      console.log('user data --->:' , userData);
      const token = users.generateToken(userData);
      return token;
    })
    .then((token) =>{
      console.log('token -->:' , token);
      res.json({ token });
    })
    .catch((err) =>res.status(403).send('error again !!!'));
}
  
function signinHandler(req,res){
  res.json({ token: req.token , user: req.user });

}

async function usersHandler(req, res) {
  return await users.get().then((result)=>{
    res.json(result);
  });
}

module.exports = router;
