const express = require('express');
const bodyParser = require('body-parser');
const DbContorller = require('../controlers/db-controller');

const jsonParser = bodyParser.json();

class DbRouter {
    constructor() {
        this.router = express.Router();
        this.controller = new DbContorller();
        this.routes();
    }

    routes(){
        this.router.post('/', jsonParser, this._addProduct.bind(this));
        this.router.get('/', jsonParser, this._getAll.bind(this));
        this.router.get('/:id', jsonParser, this._getProduct.bind(this));
    }

    _addProduct(req, res){
        const itemData = req.body;
        this.controller.addProduct(itemData.name, itemData.count, itemData.description, itemData.price)
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


}

module.exports = DbRouter;