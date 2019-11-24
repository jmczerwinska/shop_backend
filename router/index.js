const express = require('express');
const AuthRouter = require('./auth');
const DbRouter = require("./db")

class AppRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    routes(){
        this.router.use('/auth', new AuthRouter().router);
        this.router.use('/db', new DbRouter().router);
    }
}


module.exports = AppRouter;