var express = require('express');
var Q = require('q');
var WordPressConnector = require('./lib/wp-connector');
var cordova = require('cordova');
var __gulp = require('gulp');

var __gulpTemplate  = require('gulp-template');
var __gulpFilter  = require('gulp-filter');

//'http://45.79.68.152'
function generateAppForUrl(url) { 
    var appGenerationDefer = Q.defer();
    var wp = new WordPressConnector(url);

     wp.connect().then(function(r) { 

        var options = {
                appTitle: wp.jsonInfo.name,
                headerBackground: '',//'url("http://theinsatiablegamer.com/wp-content/uploads/2015/03/bannerbg.jpg");',
                headerHeight:80,
                endpoint: wp.url + '/wp-json/wp/v2',
                menu: null

        };
        console.log(wp.jsonInfo);
        var strippedUrl = (wp.jsonInfo.url || wp.jsonInfo.URL).replace('http://','').replace('https://','').replace('/','');
        var steps  = [];

        wp.getNavigationItems().then(function(r) { console.log("GeneratingNav....."); options.menu = r; })
        .then(function() { 
            var d = Q.defer();
             cordova.create(strippedUrl,strippedUrl.split('.').reverse().join(".") + '.app',wp.jsonInfo.name,function() { 

               d.resolve();

             });
            return d.promise;
        }).then(function() { 
            console.log("Processing Templates....");
            var jsFilter = __gulpFilter(['**/app.js','**/*.html', '**/*.css'], {restore: true});
            __gulp
                .src(['src/www/**/*.*'])
                .pipe(jsFilter)
                .pipe(__gulpTemplate(options))
                .pipe(jsFilter.restore)
                .pipe(__gulp.dest(strippedUrl + "/www/"));

            return true;
        }, function(err) { console.log(err); })
            .then(function() { 
            var d = Q.defer();
            process.chdir(strippedUrl);
            cordova.platform('add','android', function() {  d.resolve(); });
            return d.promise;
        }).then(function() { 
            console.log("Running....");
            var d = Q.defer();
             cordova.build(function() { appGenerationDefer.resolve(); });
            return d.promise;
        }).catch(function(e) { console.log("ended",e); });

    });
    return appGenerationDefer.promise;
}
var app = express()
 var fs = require('fs');
//generateAppForUrl(process.argv[2]);
app.use(express.static('public'));
app.get('/generate', function(req, res) {
     
  generateAppForUrl(req.query.url).then(function() {
      var fileName = req.query.url.replace('http://','').replace('https://','').replace('/','');
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '.apk');  
      console.log("sending file");
      var file = __dirname +"/"+ fileName + "/platforms/android/build/outputs/apk/android-debug.apk";
      var filestream = fs.createReadStream(file);
       filestream.pipe(res);
      //torquemag.io\platforms\android\build\outputs\apk
  });
//  res.send('hello ' + req.query.url);
    
});

app.listen(3000);
