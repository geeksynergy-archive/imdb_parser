const csv = require('csv-parser');
var fs = require('fs');
var Crawler = require("crawler");
var default_imdblink = 'https://www.imdb.com/title/';


//fs.readFile('movie_tt.csv', 'utf8', function (err, data) {});
//fs.readFile('IMDB\ TT\ Lists/150\ Super\ Hero\ Films_\ Batman,\ Spider-Man,\ Superman.csv', 'utf8', function (err, data) {})

var obj = {
    movies: []
};

fs.readFile('imdb_scraped.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        //obj.movies.push({id: 2, square:3}); //add some data
        //json = JSON.stringify(obj); //convert it back to json
        //fs.writeFile('imdb_scraped.json', json, 'utf8', callback); // write it back 
    }
});



var c = new Crawler({
    maxConnections: 30,
    rateLimit: 30,
    callback: function(error, res, done) {
        if (error) {
            console.log(error);
        } else {

            try {

                var $ = res.$;
                // $ is Cheerio by default a lean implementation of core jQuery designed specifically for the server
                //console.log("Webpage : " + $("title").text().trim());	    

                //console.log("Year : " + $("a[href*='/year/']").text().trim());
                //console.log("Release Date : " + $("h4:contains('Release Date:')").parent().clone().children().remove().end().text().trim());

                //$(".title_wrapper > h1:nth-child(1) > #titleYear").remove();
                //console.log("Title : " + $(".title_wrapper > h1:nth-child(1)").text().trim());

                //$(".title_wrapper > div > a").each(function(index, value){console.log("Genre : " + $(this).text());});
                //$("div.see-more:nth-child(8) > a").each(function(index, value){console.log("Genre : " + $(this).text());});
                //console.log("Genre : " + $("h4:contains('Genres:')").parent().clone().children("a[href*='/search/title?genres=']").text().trim()); 

                //console.log("Run-Time : " + $(".title_wrapper > div > time").attr("datetime").trim());
                //console.log("Run-Time : " + $(".title_wrapper > div > time").text().trim());

                //console.log("IMDB Rating : " + $("span[itemprop='ratingValue']").text().trim());

                //console.log("Synopsis : " + $("div.inline:nth-child(3) > p:nth-child(1) > span:nth-child(1)").text().trim());

                //console.log("Poster : " + $(".poster > a:nth-child(1) > img:nth-child(1)").attr("src"));

                //console.log("Country : " + $("a[href*='country_of_origin']").text().trim());

                //console.log("Language : " + $("a[href*='primary_language']").text().trim());

                //console.log("Color : " + $("a[href*='colors']").text().trim());

                //console.log("Director : " + $("h4:contains('Director:')").parent().children("a").text());

                //console.log("Cast : " );
                //$(".cast_list").has('.odd','.even').each(function(index, value){console.log($("a[href*='/name/nm']",this).text().trim());});


                //console.log("IMDB TT : " + $("meta[property='pageId']").attr("content").trim());


                var imdb_schema = JSON.parse($('head').children("script[type*='application/ld+json']").text());
                //console.log(imdb_schema);

                // This should work in node.js and other ES5 compliant implementations.
                function isEmptyObject(obj) {
                    return !Object.keys(obj).length;
                }

                // This should work both there and elsewhere.
                function isEmptyObject(obj) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            return false;
                        }
                    }
                    return true;
                }

                function get_person_names(personsdata_array) {
                    //console.log(personsdata_array);
                    var list_persons = '';
                    if (!Array.isArray(personsdata_array) || !personsdata_array.length) {
                        return personsdata_array.name;
                    } else {
                        personsdata_array.forEach((ind_director) => {
                            //console.log(ind_director);
                            if (list_persons == '') {
                                list_persons = ind_director.name;
                            } else {
                                list_persons = list_persons + ',' + ind_director.name;
                            }
                        });
                        return list_persons;
                    }
                }

	   	var val_Year = $("a[href*='/year/']").text().trim();
		$(".title_wrapper > h1:nth-child(1) > #titleYear").remove()
                var val_Title = $(".title_wrapper > h1:nth-child(1)").text().trim();
                //var val_Year = $("a[href*='/year/']").text().trim();
                var val_Rated = isEmptyObject(imdb_schema.contentRating) ? 'Not Rated' : imdb_schema.contentRating;
                //var val_Released = $("h4:contains('Release Date:')").parent().clone().children().remove().end().text().trim();
                var val_Released = isEmptyObject(imdb_schema.datePublished) ? '' : imdb_schema.datePublished;
                var val_Runtime = $(".title_wrapper > div > time").attr("datetime").trim().replace('PT', '').replace('M', '').replace('H', '').replace('S', '') + " min";
                //var val_Genre = $("h4:contains('Genres:')").parent().clone().children("a[href*='/search/title?genres=']").text().trim();
                var val_Genre = imdb_schema.genre;
                //var val_Director = $("h4:contains('Director:','Directors:')").parent().children("a").text();
                var val_Director = get_person_names(imdb_schema.director);

                var val_Writer = "";
                $("h4:contains('Writer')").parent().children("a[href*='/name/nm']").each(function(index, value) {
                    val_Writer += (val_Writer != "" ? ',' : '') + $(this).text().trim()
                });


                var val_Actors = get_person_names(imdb_schema.actor);
                var val_Plot = $("div.inline:nth-child(3) > p:nth-child(1) > span:nth-child(1)").text().trim();

                var val_Language = "";
                $("h4:contains('Language:')").parent().children('a').each(function(index, value) {
                    val_Language += (val_Language != "" ? ',' : '') + $(this).text().trim()
                });

                var val_Country = "";
		$("a[href*='country_of_origin']").each(function(index, value) {
                    val_Country += (val_Country != "" ? ',' : '') + $(this).text().trim()
                });
                var val_Poster = $(".poster > a:nth-child(1) > img:nth-child(1)").attr("src");
                var val_Ratings = [];
                var val_Metascore = "";
                var val_imdbRating = $("span[itemprop='ratingValue']").text().trim();
                var val_imdbID = $("meta[property='pageId']").attr("content").trim();
                var val_Type = imdb_schema['@type'];
                var val_DVD = "";
                var val_BoxOffice = "";
                var val_Production = "";
                var val_Website = "";
                var val_Response = true;


                //START WRITING DATA TO THE File

                var omdb_schema_string = {
                    "Title": val_Title,
                    "Year": val_Year,
                    "Rated": val_Rated,
                    "Released": val_Released,
                    "Runtime": val_Runtime,
                    "Genre": val_Genre,
                    "Director": val_Director,
                    "Writer": val_Writer,
                    "Actors": val_Actors,
                    "Plot": val_Plot,
                    "Language": val_Language,
                    "Country": val_Country,
                    "Poster": val_Poster,
                    "Ratings": val_Ratings,
                    "Metascore": val_Metascore,
                    "Rating": val_imdbRating,
                    "imdbID": val_imdbID,
                    "Type": val_Type,
                    "DVD": val_DVD,
                    "BoxOffice": val_BoxOffice,
                    "Production": val_Production,
                    "Website": val_Website,
                    "Response": val_Response
                };

                //var omdb_schema = JSON.parse(omdb_schema_string);
                console.log(omdb_schema_string);
                obj.movies.push(omdb_schema_string)
                json = JSON.stringify(obj);
                fs.writeFile('imdb_scraped.json', json, 'utf8', function(err, result) {
                    if (err) console.log('error', err);
                });
            } catch (ex) {
                console.log("Error Occured" + ex);
            }

        }
        done();
    }
});




// Queue just one URL, with default callback
//c.queue(default_imdblink + 'tt0309432');
//c.queue(default_imdblink + 'tt0066763');
//c.queue(default_imdblink + 'tt0111161');
//c.queue(default_imdblink + 'tt1375666');


fs.createReadStream('IMDB\ TT\ Lists/150\ Super\ Hero\ Films_\ Batman,\ Spider-Man,\ Superman.csv') //('movie_id.csv')  
    .pipe(csv())
    .on('data', (row) => {
        //console.log(row);
        //c.queue();
        console.log(row.URL);
        c.queue(row.URL);
        //c.queue(default_imdblink + row.imdb_link);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
