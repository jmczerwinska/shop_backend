const express = require('express');
const AppRouter = require('./router');
const cors = require('cors');
const path = require('path');

class App {
    constructor(){
        this.httpApp = express();
        this.httpApp.use(cors());
        console.log('App had been created');
        this.startServer(3000).then(() => {
            console.log('Server has been strated at port 3000');
        });
        this.httpApp.use('/api', new AppRouter().router);
        this.httpApp.use('/static', express.static(path.join(__dirname, 'images')));
        
    }
    
    startServer(portNo) {
        return new Promise ((resolve) => {
            this.httpApp.listen(portNo, () => {
                resolve();
            })
        })
    }
}

const app = new App();
