'use strict';

function notFoundHandler(req, res, next) {

  res.status(404);

  res.send({err: ' Page not found'});
}

module.exports = notFoundHandler;