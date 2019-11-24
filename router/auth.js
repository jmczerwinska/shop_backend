const express = require('express');
const bodyParser = require('body-parser');
const AuthContorller = require('../controlers/auth-controller');

const jsonParser = bodyParser.json();

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.controller = new AuthContorller();
        this.routes();
    }
    routes(){
        // POST api/auth/
        this.router.post('/', jsonParser, this._checkPassword.bind(this));
        this.router.post('/create', jsonParser, this._createUser.bind(this));
        // PUT api/auth
        this.router.put('/', jsonParser, this._changePassword.bind(this));
    }

    _checkPassword(req, res) {
        this.controller.checkPassword()
    }

    _createUser(req, res) {
        const  userData = req.body;
        this.controller.createUser(userData.login, userData.password, userData.email)
        .then(respons => {
            res.send(respons)
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    }
    
    _changePassword(req, res){}

}
module.exports = AuthRouter;