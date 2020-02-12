const express = require('express');
const bodyParser = require('body-parser');
const DbController = require('../controlers/db-controller');
const multer = require('multer');
const path = require('path');

const jsonParser = bodyParser.json();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
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
        this.router.put('/:id', upload.single('img'), this._updateProduct.bind(this));
        this.router.put('/:id/buy', jsonParser, this._buyProduct.bind(this))
        this.router.get('/', jsonParser, this._getAll.bind(this));
        this.router.get('/:id', jsonParser, this._getProduct.bind(this));
        this.router.delete('/:id',jsonParser, this._deleteProduct.bind(this));
    }

    _addProduct(req, res){
        const { name, count, description, price } = req.body;
        const img = req.file.filename;
        if (name === undefined || count === undefined || img === undefined ||
            description === undefined || price === undefined) {
            res.status(400).send("Incorrect data - some fields are missing");
        } else {
            this.controller.addProduct(name, count, description, price, img)
            .then(response => res.send(response))
            .catch(err => res.status(err.status).send(err));
        }
    }

    _getAll(req, res){
        this.controller.getAll()
            .then((result) => {
                const data = result.rows.map((item) => item.doc);
                res.send(data);
            })
            .catch(err => res.status(err.status).send(err));
    }

    _getProduct(req, res){
        const id = req.params.id;
        this.controller.getProductId(id)
            .then(response => {
                res.send(response);
            })
            .catch(err => res.status(err.status).send(err));
    }

    _deleteProduct(req, res) {
        const id = req.params.id;
        this.controller.getProductId(id)
            .then(doc => {
                // console.log(req.body, doc);
                this.controller.deleteProduct(doc);
            })
            .then(response => res.send(response))
            .catch(err => res.status(err.status).send(err));
    }

    _updateProduct(req, res) {
        const id = req.params.id;
        const newData = req.body;
        const imgPath = req.file.path;
        
        this.controller.getProductId(id)
           .then(doc => this.controller.updateProduct(doc, newData, imgPath))
           .then(response => res.send(response))
           .catch(err => res.status(err.status).send(err));
    }

    _buyProduct(req, res) {
        const id = req.params.id;
        const buyCount = req.body.count;

        this.controller.getProductId(id)
          .then(doc => this.controller.buyProduct(doc, buyCount))
          .then(response => res.send(response))
          .catch(err => res.status(err.status).send(err));
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