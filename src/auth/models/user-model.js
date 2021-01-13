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
        console.log('myData--->', record)
        let data = await this.get({ username: record.username });

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
        const token = jwt.sign({ username: user.username, }, SECRET, { expiresIn: 15 * 60 }, { algorithms: ['RS256'] });
        return token;
    }
    // to verify the token that the user used from the client that was generated by jwt

    async authenticateToken(token) {
        try {
            const tokenObj = jwt.verify(token, SECRET);
            // console.log(tokenObj)
            const check = await this.get({ username: tokenObj._id });
            if (check) {

                return Promise.resolve(tokenObj);
            } const secCheck = await this.get({ username: tokenObj.username });
            if (secCheck) {

                return Promise.resolve(tokenObj);
            }
            else {
                return Promise.reject();
            }
        } catch (err) {
            console.log('Invalid user');
            return Promise.reject(err);
        }
    }

}
module.exports = new Users();