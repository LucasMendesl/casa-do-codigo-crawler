var bluebird = require('bluebird');
var request  = bluebird.promisify(require('request'));
var cheerio  = require('cheerio');
var async	 = require('async');

var BASE_URL = 'https://www.casadocodigo.com.br';

var headers = {
	'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
	'Host':'www.casadocodigo.com.br'
};

function BookCollection() {
	this.books = [];
}

function getBookBySpec (spec) {
	return request({
		url: BASE_URL.concat('/collections/', spec),
		jar: true,
		headers: headers,
		encoding: null
	})
	.then(function(result){
		var html = new Buffer(result.body, 'ascii').toString('utf8');
		var $ = cheerio.load(html);

		var allLinks = [];

		$('.vitrineDaColecao-lista a').each(function() {
			allLinks.push({link: BASE_URL.concat($(this).attr('href')), imageLink: 'https:' + $(this).find('img').attr('src') });
		});

		return allLinks;
	});
}

function getBookInfo( urlList ){

    return new bluebird(function (resolve, reject){
				var collection = new BookCollection();

        async.whilst(function(){
            return urlList.length > 0;
        },
        function (callback){
            var currentUrl = urlList.shift();

            request({
                url: currentUrl.link,
                jar: true,
                headers: headers,
                encoding: null
            })
            .then(function (result) {
                var html = new Buffer(result.body, 'ascii').toString('utf8');
                var $ = cheerio.load(html);

                var bookInfo = {
                    titulo: $('.cabecalhoProdutoLivro-titulo-principal').text().trim() + ' ' +
                           $('.cabecalhoProdutoLivro-titulo-sub').text().trim(),
                    descricao: $('.infoSection').eq(0).find('p').text().replace(/\sveja o sumário completo/g,'').trim().replace(/\t\n/g, '').replace(/\n\t/g, '').replace(/\t/g, ''),
                    preco: parseFloat($('.adicionarAoCarrinho-preco-valor').eq(1).text().trim().replace('R$', '').replace(/\s/, '').replace(',', '.')),
                    urlImagem: currentUrl.imageLink
                }

								collection.books.push(bookInfo);
                callback();
            });
        },
        function (err){
            if (err)
                reject(err);

            resolve(collection.books);
        });
    });
}

module.exports = {
	 getBookByRoute : function(route) {
		  return getBookBySpec(route)
				.then(getBookInfo);
	 },

	 getAllBooks: function () {
		 	return getBookBySpec('todos')
				.then(getBookInfo);
	 }
}
