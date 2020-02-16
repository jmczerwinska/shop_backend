const express = require('express');
const bodyParser = require('body-parser');
const AuthController = require('../controllers/auth-controller.js');

const jsonParser = bodyParser.json();

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.controller = new AuthController();
        this.routes();
    }
    routes(){
        //GET api/auth/
        this.router.get('/', jsonParser, this._getAllUsers.bind(this));
        // POST api/auth/login
        this.router.post('/login', jsonParser, this._checkPassword.bind(this));
        // POST api/auth/create
        this.router.post('/create', jsonParser, this._createUser.bind(this));
        // PUT api/auth/:id
        this.router.put('/:id', jsonParser, this._changePassword.bind(this));
        //DELETE api/auth/:id
        this.router.delete('/:id', jsonParser, this._deleteUser.bind(this));
    }

    _getAllUsers(req,res) {
        this.controller.getAllUsers()
            .then((result) => {
                const data = result.rows.map(user => user.doc);
                res.send(data);
            })
            .catch(err => res.status(err.status).send(err));
    }

    _checkPassword(req, res) {
        const userData = req.body;
        this.controller.checkPassword(userData.login, userData.password)
            .then(response => {
                if (response.docs.length ===0) {
                    res.status(401).send('Wrong credentials');
                } else {
                    res.status(200).send(response.docs[0])
                }
        })
            
    }

    _createUser(req, res) {
        const  userData = req.body;
        this.controller.checkLogin(userData.login).then(result => {
            if(result.docs.length > 0) {
                console.log(result.docs)
                res.status(409).send('Conflict');
            } else {
                 this.controller.createUser(userData.login, userData.password, userData.email)
                    .then(response => res.send(response));
            }
        })
        .catch(err => res.status(err.status).send(err));
    }

    _deleteUser(req, res) {
        const id = req.params.id;

        this.controller.deleteUser(id)
            .then(result => res.send(result))
            .catch(err => res.status(err.status).send(err));
    }
    
    _changePassword(req,res){
        const id = req.params.id;
        this.controller.changePassword(id, req.body)
            .then(response => res.send(response))
            .catch(err => res.status(err.status).send(err));
    }


}
module.exports = AuthRouter;