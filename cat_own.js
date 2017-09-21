var http = require('http'),
    express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    fileSave = require('file-save')
    vow = require('vow');

var get_table = [],
    full_table = [];

var getUrlTables = function (i, url, title) {

    full_table[i]=vow.defer();

    request({uri:url,method:'GET',encoding:'binary'}, function (err, res, body) {
        var $ = cheerio.load(body);
        $('.price.m--mobile_font').each(function(){
            full_table.push({
                src: $('span',this).text(),
                link: url
            });

            console.log(full_table)
        });
    });
    return full_table[i];
};

var crawlData = (function () {

    var urls=[
        {link: 'http://apteka.ru/nurofen/catalog/nurofen-0-1-5ml-200ml-susp-d-detey-apelsin-_56a64c841f170/'},
        {link: 'http://apteka.ru/catalog/ibuprofen-0-2-n20-kaps-_5836cfd850a0f/ '}
    ];


    //Обрабатываем каждый адрес из списка
    for (var i in urls) {
        if (!isNaN(parseInt(urls[i].link.split('watch/')[1]))) {
            urls[i].link += '/description';
        }

        console.log(urls[i].link);
        getUrlTables(i, urls[i].link);
    }


/*    vow.all(full_table).spread(function (building) {
        //Сохраняем результат

        fileSave('sample/test')
            .write(full_table, 'utf8')
            .write('this is the second line', 'utf8', function() {
                console.log('writer callback')
            })
            .end('this is the end')
            .error(function() {
                console.log('error goes here')
            })
            .finish(function() {
                console.log('write finished.')
            })
    }) */

});


crawlData();