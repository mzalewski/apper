var WP = require('wordpress-rest-api');
var wp = new WP({ endpoint:'http://45.79.68.152/wp-json/wp/v2', username:"tigadmin",password:"tig123TIG!@#"});
wp.media().then(function(d) { console.log(d); });

//model.get("taxonomies[0..4]").then(function(r){  console.log(JSON.stringify(r)); },function(e) { console.log(e); });