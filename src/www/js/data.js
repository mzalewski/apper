app.run(function(offline, $http) { 
  // offline.start($http); 
});
var wpBuildUrl = null;

// friends factory
 app.factory('WP', ['$q', '$window', function ($q, $window) { 
     return $window.WP;
 }]);
app.factory('WordPress',['$http', 'Config', 'WP', function($http, Config, WPApi) {
	var data = {};
    var api = new WPApi({endpoint:Config.WordPress});
    return api;
}]);
app.factory('WordPressComent', ['$http','Config', function($http,Config) {
	var WordPressComent = {};
	WordPressComent.addComment = function(postId, name, email, url, content) {
		var data = "";
		data = 'post_id='+postId+'&name='+name+'&email='+email;
		data += '&url='+url+'&content='+content;
		return $http(
			{
				method: 'GET', 
				url:wpBuildUrl('respond_submit_comment',data)
			}
		);
	}
	
  	return WordPressComent;
}])
app.factory('globalFactory',[function() {
	return {
		// get first image or feed
		getPostImageFeed: function( postContent ) {
			var div = document.createElement('div');
			div.innerHTML = postContent;
			var img = div.getElementsByTagName("img");
			var iframe = div.getElementsByTagName("iframe");
			if (img.length >= 1) {
				imgthumb = img[0].src;
				return imgthumb;
			} else if (iframe.length >= 1){
				iframeVideo = iframe[0].src;
				var re = /(\?v=|\/\d\/|\/embed\/)([a-zA-Z0-9\-\_]+)/;
				videokeynum = iframeVideo.match(re);
				if(videokeynum) {
					videokey = iframeVideo.match(re)[2];
					imageurl = 'http://i2.ytimg.com/vi/'+videokey+'/0.jpg';
					return imageurl;	              
			  }
			}
		},
		getDateData: function(dt){
			var dates = {
				'01' : 'January',
				'02' : 'February',
				'03' : 'March',
				'04' : 'April',
				'05' : 'May',
				'06' : 'June',
				'07' : 'July',
				'08' : 'August',
				'09' : 'September',
				'10' : 'October',
				'11' : 'November',
				'12' : 'December',
			}
			return dates[dt];
		}
	};
}]);
app.factory('HomePageCats', [ function(){
    var data = {};
    
    data.items = [
        { 
            title: 'Featured',
            slug: 'slider',
        }
    ]; 
    
    return data;
}])