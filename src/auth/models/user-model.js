'use strict';
require('dotenv').config();
const schema = require('./users-schema');
const Model = require('./model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET || 'MySecret';


class Users extends Model {
    constructor() {
        super(schema);
    }

    async save(record) {
        let data = await this.get({ username: record.username });
        console.log('myData', record)
        
        if (data.length === 0) {
            record.password = await bcrypt.hash(record.password, 5);
            console.log('record after hash', record);
            return await this.create(record)
        }

        return Promise.reject('this user is already signUp');
    }

    async authenticateBasic(user, pass) {
        const myUser = await this.get({ username: user });
        const valid = await bcrypt.compare(pass, myUser[0].password);
        return valid ? myUser : Promise.reject('wrong password');
    }

    generateToken(user) {
        const token = jwt.sign({ username: user.username }, SECRET);
        return token;
    }
}
module.exports = new Users();