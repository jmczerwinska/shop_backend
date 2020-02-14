const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

class AuthController {
    constructor(){
        this.db = new PouchDB('db/auth');

    }

    getAllUsers(){
        return this.db.allDocs({ include_docs: true });
    }

    changePassword(id,data){
        return this._getUser(id).then(user => this._updateUser(user,data));
    }

    createUser(login, password, email){
        return this.db.post({
            login,
            password,
            email
        });
    }
    
    checkPassword(login, password){
        return this.db.find({
            selector: {login ,password},
            fields: ['_id','login']
        });
    }

    checkLogin (login) {
        return this.db.find({
            selector: { login },
            fields: ['login']
        });
    }

    deleteUser(id) {
        return this._getUser(id)
        .then(user => this.db.remove(user));
    }

    _getUser(id) {
        return this.db.get(id);
    }

    _updateUser(user, data){
        return this.db.put({...user, ...data})
    }
}

module.exports = AuthController;