'use strict'

require('dotenv').config()
let server = require('./src/server.js')
let mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

server.start(process.env.PORT);