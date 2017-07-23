const Promise = require('bluebird');
const express = require('express');
const cors = require('cors');
const fs   = Promise.promisifyAll(require('fs'));
const path = require('path');

class Application {
    
    constructor() {
        
        this.configure();
        this.registerControllers();

        this.app.use(this.handleNotFoundError);
		this.app.use(this.handleInternalServerError);
    }

    get app (){

        if (!this._app){
            this._app = express();
        }

        return this._app;
    }

    configure () {
        this.app.use(cors());
        this.app.disable('x-powered-by');

        this.app.set('port', process.env.PORT || 3000);
    }


    registerControllers () {
        let controllersPath = path.join(__dirname, 'controllers');    
		let files = fs.readdirSync(controllersPath);

		for (let file of files) {
			let controllerFile = path.join(controllersPath, file);
			let stat = fs.lstatSync(controllerFile);

			if (stat.isFile()) {
				let controller = require(controllerFile);
				controller.setup();

                this.app.use(controller.router);
			}
		}
    }

    handleNotFoundError (req, res, next) {
		return res.status(404).json({
            error: 'Resource not found!',
            url: req.url,
            method: req.method.toLowerCase()
        });
    }

    handleInternalServerError (err, req, res, next) {
		return res.status(500).json({
                error: err.message,
                url: req.url,
                method: req.method.toLowerCase()
            });
    }
}


module.exports = () => {
    return new Application().app;
}