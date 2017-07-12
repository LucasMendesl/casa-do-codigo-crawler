const Bluebird = require('bluebird');
const request  = Bluebird.promisify(require('request'));
const cheerio  = require('cheerio');
const async	   = require('async');

const BASE_URL = 'https://www.casadocodigo.com.br';

let getBookPrices = ($) => {
    let prices = [];
    $('.adicionarAoCarrinho-listaOfertas li p').each((key, value) => prices.push($(value).text().trim().replace(/\t\n/gi, '')));    
    return prices;
}

let prepareRequestData = (url) => {
    let data = {
         url: url,
        jar: true,
        headers: {
	        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
	        'Host':'www.casadocodigo.com.br'
        },
        encoding: null
    };

    return data;
}

module.exports = class BooksRepository {

    extractLinks (spec) {
        return new Bluebird((resolve, reject) => {
             request(prepareRequestData(`${BASE_URL}/collections/${spec}`))
	            .then(result => {
		            let html = new Buffer(result.body, 'ascii').toString('utf8');
		            let $ = cheerio.load(html);
                    let allLinks = [];
                
		            $('.vitrineDaColecao-lista a').each((index, data) => {
			            allLinks.push({
                            link: `${BASE_URL}${$(data).attr('href')}`, 
                            imageLink: `https:${$(data).find('img').attr('src')}`  
                        });            
                    });

		            resolve(allLinks);
                })
                .catch(err => reject(err));
            });
    }

    getBooksInfo (urls){
         return new Bluebird((resolve, reject) => {
			let bookCollection = [];

            async.whilst(() => urls.length > 0, callback => {
                let currentUrl = urls.shift();                
                 
                request(prepareRequestData(currentUrl.link))
                    .then(function (result) {
                        let html = new Buffer(result.body, 'ascii').toString('utf8');
                        let $ = cheerio.load(html);

                        bookCollection.push({
                            title: `${$('.cabecalhoProdutoLivro-titulo-principal').text().trim()} ${$('.cabecalhoProdutoLivro-titulo-sub').text().trim()}`,
                            description: $('.infoSection').eq(0).find('p').text().replace(/\sveja o sumário completo/g,'').trim().replace(/\t\n/g, '').replace(/\n\t/g, '').replace(/\t/g, ''),
                            price: getBookPrices($),
                            imageUrl: currentUrl.imageLink            
                        });

                        callback();
                    });                
            
            }, (err) => {
                if (err){
                    reject(err);
                }
                resolve(bookCollection);
            });         
        });
    }    
}