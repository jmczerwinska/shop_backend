const express = require('express');
const AuthRouter = require('./auth');

class AppRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    routes(){
        this.router.use('/auth', new AuthRouter().router)
    }
}


module.exports = AppRouter;