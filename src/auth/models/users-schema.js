'use strict';

const mongoose = require('mongoose');

const users = mongoose.Schema({
  username : {type : String , required : true},
  password : { type : String , required : true},
  role: { type: String, defult: 'user', lowercase: true, enum: ['user', 'writer', 'editor', 'admin']}

});



module.exports = mongoose.model('users', users);