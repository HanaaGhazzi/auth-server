'use strict';

const bearerAuth = require('./auth/middleware/bearer-auth');
const router = require('./auth/router');

router.get('/secret', bearerAuth, bearerHandler);

function bearerHandler(req, res){
  res.json(req.user);
}

module.exports = router;