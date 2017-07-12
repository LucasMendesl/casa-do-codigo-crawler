const Promise       = require('bluebird');
const express       = require('express');
const cors          = require('cors');
const path          = require('path');
const fs            = require('fs');

class Application {

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.disable('x-powered-by');

        this.app.set('port', process.env.PORT || 3000);

        this.configureRoutes();

        this.app.use((req, res, next) => {
			return res.status(404).json({
                error: 'Resource not found!',
                url: req.url,
                method: req.method.toLowerCase()
            });
		});

		this.app.use((err, req, res, next) => {			
			return res.status(500).json({
                error: err.message,
                url: req.url,
                method: req.method.toLowerCase()
            });
		});
    }


    configureRoutes(){
        require('./books/books.controller')(this.app);
    }
}


module.exports = () => {
    let application = new Application();
    return application.app;
}