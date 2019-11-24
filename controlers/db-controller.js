const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

class DbController {
    constructor(){
        this.db = new PouchDB('../db/items');
    }

    addProduct(name, count, description, price){
        return this.db.post({
            name,
            count,
            description,
            price
        })

    }

    getAll(){
        return this.db.allDocs({include_docs:true});
    }

    getProductId(id){
        return this.db.get(id)
    }
}
module.exports = DbController;