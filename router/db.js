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
        this.router.get('/', jsonParser, this._getAll.bind(this));
        this.router.get('/:id', jsonParser, this._getProduct.bind(this));
        this.router.delete('/:id',jsonParser, this._deleteProduct.bind(this));
    }

    _addProduct(req, res){
        console.log(req.file.path);
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
            // .then(response => {
            //     console.log(response.status);
            //     if (response.status === "404") {
            //         res.status(404).send('Not found');
            //     } else {
            //         res.status(200).send(response)
            //     }
            // })
            .catch(err => res.status(500).send(err));
    }

    _deleteProduct() {
        
    }

    _updateProduct() {

    }

    _buyProduct() {

    }

}

module.exports = DbRouter;