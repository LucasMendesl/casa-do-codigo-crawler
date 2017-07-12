const BooksRepository = require('./books.repository');
const repository = new BooksRepository();

class BooksController {

    constructor(app){
        this.app = app;
        
        this.useRoutes([{
            path: '/books',
            method: 'GET',
            response: this.getAllBooks 
        },{
            path: '/books/:bookCategory',
            method: 'GET',
            response: this.getBookBySpec
        }]);
    }

    getAllBooks(req, res) {
         repository.extractLinks('todos')
             .then(repository.getBooksInfo)
             .then(result =>  res.send(result));     
    }

    getBookBySpec(req, res) {
          repository.extractLinks(req.params.bookCategory)
              .then(repository.getBooksInfo)
              .then(result =>  res.send(result));     
    }

    useRoutes(configs){
        configs.map(config => this.app[config.method.toLowerCase()](config.path, config.response));
    }
}

module.exports = (app) => {
    let controller = new BooksController(app);
}