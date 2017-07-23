const Controller      = require('./base/controller');
const BooksRepository = require('../data/books.repository');

const repository = new BooksRepository();

module.exports = class BooksController extends Controller {

    static setup() {
        
        this.action({
            method: 'GET',
            actionName: 'getAllBooks',
            path: '/api/books'            
        });

        this.action({
            method: 'GET',
            actionName: 'getBookBySpec',
            path: '/api/books/:bookCategory'
        });
    }

    getAllBooks() {
        return repository.extractLinks('todos')
                         .then(repository.getBooksInfo);     
    }

    getBookBySpec() {
          return repository.extractLinks(this.params.bookCategory)
                           .then(repository.getBooksInfo)     
    }
}