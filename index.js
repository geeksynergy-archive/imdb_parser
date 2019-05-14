var fs = require('fs');
var Crawler = require("crawler");
var default_imdblink = 'https://www.imdb.com/title/';


//fs.readFile('movie_tt.csv', 'utf8', function (err, data) {});

var obj = {
   movies: []
};

fs.readFile('imdb_scraped.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    //obj.movies.push({id: 2, square:3}); //add some data
    //json = JSON.stringify(obj); //convert it back to json
    //fs.writeFile('imdb_scraped.json', json, 'utf8', callback); // write it back 
}});

var c = new Crawler({
    maxConnections : 1,
    rateLimit: 1,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{

            var $ = res.$;
            // $ is Cheerio by default a lean implementation of core jQuery designed specifically for the server
            console.log("Webpage : " + $("title").text().trim());	    

	    console.log("Year : " + $("a[href*='/year/']").text().trim());
	    console.log("Release Date : " + $("h4:contains('Release Date:')").parent().clone().children().remove().end().text().trim());

	    $(".title_wrapper > h1:nth-child(1) > #titleYear").remove();
            console.log("Title : " + $(".title_wrapper > h1:nth-child(1)").text().trim());

            //$(".title_wrapper > div > a").each(function(index, value){console.log("Genre : " + $(this).text());});
	    //$("div.see-more:nth-child(8) > a").each(function(index, value){console.log("Genre : " + $(this).text());});
	    console.log("Genre : " + $("h4:contains('Genres:')").parent().clone().children("a[href*='/search/title?genres=']").text().trim()); 

            console.log("Run-Time : " + $(".title_wrapper > div > time").attr("datetime").trim());
            console.log("Run-Time : " + $(".title_wrapper > div > time").text().trim());

	    console.log("IMDB Rating : " + $("span[itemprop='ratingValue']").text().trim());

            console.log("Synopsis : " + $("div.inline:nth-child(3) > p:nth-child(1) > span:nth-child(1)").text().trim());

            console.log("Poster : " + $(".poster > a:nth-child(1) > img:nth-child(1)").attr("src"));

	    console.log("Country : " + $("a[href*='country_of_origin']").text().trim());

	    console.log("Language : " + $("a[href*='primary_language']").text().trim());

	    console.log("Color : " + $("a[href*='colors']").text().trim());

            console.log("Director : " + $("h4:contains('Director:')").parent().children("a").text());

	    console.log("Cast : " );
	    $(".cast_list").has('.odd','.even').each(function(index, value){console.log($("a[href*='/name/nm']",this).text().trim());});


	    console.log("IMDB TT : " + $("meta[property='pageId']").attr("content").trim());
	    
            var val_tt = $("meta[property='pageId']").attr("content").trim();
	    var val_year = $("a[href*='/year/']").text().trim();
	    var val_releasedata = $("h4:contains('Release Date:')").parent().clone().children().remove().end().text().trim();
	   
	    
	    obj.movies.push({tt: val_tt,year: val_year ,releasedate: val_releasedata});
	    json = JSON.stringify(obj);
	    fs.writeFile('imdb_scraped.json', json, 'utf8', function(err, result){if(err) console.log('error', err);});
            
            console.log("JSON : " + $('head').children("script[type*='application/ld+json']").text());
            
	    // START WRITING DATA TO THE File
                        
	   

        }
        done();
    }
});




// Queue just one URL, with default callback
c.queue(default_imdblink + 'tt0309432');
c.queue(default_imdblink + 'tt0066763');
c.queue(default_imdblink + 'tt0111161');
