var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var URL = 'https://www.ferra.ru/ru/techlife/news/';
var results = [];

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        var $ = cheerio.load(res.body);

        //информация о новости
        $('.newslist__title').each(function()
        {
            results.push({
                title: $('Title').text(),
                articleTitle: $('.newslist__title').text(),
                h1: $('h1').text(),
                date: $('.newslist__date').text(),
                href: url
            });
        })

        callback();
    });
}, 10); // запускаем 10 параллельных потоков

q.drain = function(){
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

q.push(URL);