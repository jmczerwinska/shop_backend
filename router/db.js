const express = require('express');
const bodyParser = require('body-parser');
const DbController = require('../controlers/db-controller');
const multer = require('multer');
const path = require('path');

const jsonParser = bodyParser.json();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "images");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


class DbRouter {
    constructor() {
        this.router = express.Router();
        this.controller = new DbController();
        this.routes();
    }

    routes(){
        this.router.post('/', upload.single('img'), this._addProduct.bind(this));
        this.router.put('/:id', jsonParser, this._updateProduct.bind(this))
        this.router.get('/', jsonParser, this._getAll.bind(this));
        this.router.get('/:id', jsonParser, this._getProduct.bind(this));
        this.router.delete('/:id',jsonParser, this._deleteProduct.bind(this));
    }

    _addProduct(req, res){
        const itemData = req.body;
        const imgPath = req.file.path;
        this.controller.addProduct(itemData.name, itemData.count, itemData.description, itemData.price, imgPath)
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err));
    }

    _getAll(req, res){
        this.controller.getAll()
        .then(response => {
            res.send(response);
        })
        .catch(err => res.status(500).send(err));
    }

    _getProduct(req, res){
        const id = req.params.id;
        this.controller.getProductId(id)
            .then(response => {
                res.send(response);
            })
            .catch(err => res.status(500).send(err));
    }

    _deleteProduct(req, res) {
        const id = req.params.id;
        this.controller.getProductId(id)
            .then(doc => {
                // console.log(req.body, doc);
                this.controller.deleteProduct(doc);
            })
            .then(response => res.send(response))
            .catch(err => res.status(err.status).send(err.message));
    }

    _updateProduct(req, res) {
        const id = req.params.id;
        const newData = req.body;
        this.controller.getProductId(id)
           .then(doc => this.controller.updateProduct(doc, newData))
           .then(response => res.send(response))
        //    .catch(err => res.status(err.status).send(err.message));
    }

    _buyProduct() {

    }

    _deleteImg(doc) {
        path = doc.img;
        false.unlink(path, (err) => {
            if (err) throw err;
            console.log('file was deleted');
        })
    }

}

module.exports = DbRouter;