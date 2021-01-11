'use strict'

function errorHandler (err, req, res, next){
    res.status(500);
    res.send({err: err});
}

module.exports = errorHandler;
