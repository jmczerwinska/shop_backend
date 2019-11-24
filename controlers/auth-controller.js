const PouchDB = require('pouchdb');

class AuthController {
    constructor(){
        this.db = new PouchDB('../db/auth');

    }

    checkPassword(){}

    createUser(login, password, email){
        return this.db.post({
            login,
            password,
            email
        });
    }
    
    changePassword(){}
}

module.exports = AuthController;