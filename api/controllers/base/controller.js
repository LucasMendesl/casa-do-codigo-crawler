const Router = require('express').Router;
const Promise = require('bluebird');

module.exports = class Controller {

    constructor (req, res) {
        this.req = req;
        this.res = res;
    }

    static get router() {
        if (!this._router){
            this._router = Router();
        }

        return this._router;
    }

    static setup() { }

    static action (config, ...pipeline) {
        let controller = this;
        
        let callback = (req, res, next) => {            
            let ctrl = new controller(req, res);
            ctrl.execute(config.actionName);
        };

        if (pipeline.length > 0)
            this.router[config.method.toLowerCase()](config.path, pipeline, callback);
        else
            this.router[config.method.toLowerCase()](config.path, callback);
    }

    execute (actionName, ...args) {

        return Promise.bind(this)
            .then(() => {
                return this[actionName](...args);
            })
            .then(result => {
                this.res.send(result);
            })
            .catch(err => {throw err;});
    }

    get params() {
        if (!this._params){
            this._params = this.req.params;
        }

        return this._params;
    }
};

