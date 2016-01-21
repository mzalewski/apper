var cheerio = require('cheerio');
var Q = require('q');
var request = require('request');


function WordPressConnector(url) {
    if (!url.endsWith('/'))
        url += "/";
    this.url = url;
}

WordPressConnector.prototype._findMenuItemLinks = function(cheerio) { 
      var getBodyData = function(link) {
        var deferred = Q.defer();
        request.get(link.url, function(err, data, body) { 
             var $ = cheerio.load(body);
            
            link.classData = $('body').attr('class') || "";
            deferred.resolve(link.classData);
        });
        return deferred.promise;
    };
        var deferred = Q.defer();
        var links = {};
        var promises = [];
        cheerio('.menu-item a').each(function() { 
            links[cheerio(this).text()] = {
                url:cheerio(this).attr('href')

            };
            promises.push(getBodyData(links[cheerio(this).text()]));

        });
    
        Q.all(promises).then(function() { deferred.resolve(links); });
        return deferred.promise;
};
WordPressConnector.prototype._getLinkRouteFromClass = function(links) { 
      
         for (var link in links) { 
             
            var newData = "";
            var dataSplit = links[link].classData.split(' ');  
            if (dataSplit.indexOf('home') >= 0) { 
                links[link].route = "home";
            }else if (dataSplit.indexOf('archive') >= 0) { 
                    var dataTax  = '';
                var dataTerm = '';
                var dataCat = '';
                for (var i = 0; i < dataSplit.length; i++) { 
                    if (dataSplit[i].indexOf('category-') == 0  && dataCat == '')
                    {
                        dataCat = dataSplit[i].substr(9);
                    }
                    if (dataSplit[i].indexOf('tax-') == 0  && dataTax == '')
                    {
                        dataTax = dataSplit[i].substr(4);
                    }
                    if (dataSplit[i].indexOf('term-') == 0  && dataTerm == '')
                    {
                        dataTerm = dataSplit[i].substr(5);
                    }
                }
                if (dataCat != '') { 
                    links[link].route = 'tax/category/' + dataCat;   
                } else { 
                    links[link].route = 'tax/' + dataTax + '/' + dataTerm;     
                }

            } else { 
                // Just a page or post
                var  page_id = "";
                var post_id = "";
                for (var i = 0; i < dataSplit.length; i++) { 
                    if (dataSplit[i].indexOf('page-id-') == 0)
                    {
                        page_id = dataSplit[i].substr(8);   
                    }
                     if (dataSplit[i].indexOf('post-id-') == 0)
                    {
                        post_id = dataSplit[i].substr(8);   
                    }
                }
                newData =  post_id == "" ? "page/" + page_id : "post/" + post_id;
                links[link].route = newData;
            }
             
        }
    
        return links;
    };
WordPressConnector.prototype.connect = function() { 
    var connector = this;
    var d = Q.defer();
    request.get(this.url + "wp-json", function(err, result,body) { 
         try {
            var info = JSON.parse(body);
             connector.jsonInfo = info;
             d.resolve(connector.jsonInfo);
          } catch (e) {
             d.reject(e);
          }
        
             
    });
    return d.promise;
};

WordPressConnector.prototype.getTaxonomies = function() { 
    
};

WordPressConnector.prototype.getImages = function() { 
    
};
WordPressConnector.prototype._loadUrl = function() { 
    var deferred = Q.defer();
    var connector = this;
    request.get(this.url, function(err, data, body) { 

        var $ = cheerio.load(body);
    
        deferred.resolve($);
    });
    return deferred.promise;  
};
WordPressConnector.prototype.getNavigationItems = function() { 
    
    var d = Q.defer();
    
    this._loadUrl()
        .then(this._findMenuItemLinks)
        .then(this._getLinkRouteFromClass)
        .then(function(links) { d.resolve(links); console.log("wer");}).catch(function(ex) { console.log(ex); });
    // First load  main  URL
    // Then get links from document
    // Then extract classNames from remote
   return d.promise;
   
 
};

module.exports =  WordPressConnector;