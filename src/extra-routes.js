'use strict';

const bearerAuth = require('./auth/middleware/bearer-auth');
const acl = require('./auth/middleware/acl.js');
const router = require('./auth/router');

router.get('/secret', bearerAuth, bearerHandler);
router.get('/read', bearerAuth, acl('read'), readHandler);
router.post('/add', bearerAuth, acl('create'), createHandler);
router.put('/change', bearerAuth, acl('update'), updateHandler);
router.delete('/remove', bearerAuth, acl('delete'), deleteHandler);

function bearerHandler(req, res){
  res.json(req.user);
}


function readHandler(req, res){
  res.send('you can read, great! ');
}

function createHandler(req, res){
  res.send('you can create , wow!');
}

function updateHandler(req, res){
  res.send('you can update, awesome !');
}

function deleteHandler(req, res){
  res.send('you can delete , perfect !');
}

module.exports = router;