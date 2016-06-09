var crawler = require('../crawler/casaDoCodigoCrawler');

module.exports = function(app) {

    app.get('/', function (req, res){
      res.send({ message: 'Casa do código Teste!' });
    });

    app.get('/api/livros/:urlCasaDoCodigo', function (req, res){
        var url = req.params.urlCasaDoCodigo;

        crawler.getBookByRoute(url)
          .then(function (result) {
            res.send(result);
          })
          .catch(function () {
              res.status(500).send({ message: 'deu ruim para buscar os livros!' })
          });
    });

    app.get('/api/livros', function (req, res){

        crawler.getAllBooks()
          .then(function (result) {
              res.send(result);
          })
          .catch( function () {
              res.status(500).send({ message: 'deu ruim para buscar os livros!' })
          });

    })
}
