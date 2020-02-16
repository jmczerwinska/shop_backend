const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

class DbController {
  constructor() {
    this.db = new PouchDB("db/items");
  }

  addProduct(name, count, description, price, img) {
    return this.db.post({
      name: name,
      count: parseInt(count),
      description: description,
      price: parseFloat(price),
      img: img
    });
  }

  getAll() {
    return this.db.allDocs({ include_docs: true });
  }

  getProductId(id) {
    return this.db.get(id);
  }

  updateProduct(doc, newData) {
    return this.db.put( { ...doc, ...newData });
  }
  
  buyProduct(doc, buyCount) {
    const count = doc.count - buyCount;

    return this.db.put({
      ...doc,
      "count": count
    });
  }

  deleteProduct(doc) {
    return this.db.remove(doc);
  }
}

module.exports = DbController;