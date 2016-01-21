app.run(function (offline, $http) {
	// offline.start($http);
});
var wpBuildUrl = null;

// friends factory
app.factory('WordPressAPI', ['$q', '$window', function ($q, $window) {
	return $window.WP;
}]);
app.factory('WordPress', ['$http', 'Config', 'WordPressAPI', function ($http, Config, WPApi) {
	var data = {};
	var api = new WPApi({ endpoint: Config.WordPress });
	alert('werwerwerre');
	wpBuildUrl = function (method, args) {
		var baseUrl = "";
		if (Config.WordPress.indexOf("public-api.wordpress.com") > -1) {
			baseUrl = Config.WordPress;
		} else if (Config.WordPress.indexOf("wordpress.com") > -1) {
			baseUrl = "https://public-api.wordpress.com/rest/v1.1/sites/" + Config.WordPress.replace('https://', '').replace('http://', '').replace('/', '') + "/";
		} else {
			baseUrl = Config.WordPress;
			return baseUrl + "?json=" + method + "&" + args;
		}

		if (method == "get_recent_posts") {
			return baseUrl + "posts?" + args;
		} else if (method == "get_tag_posts") {
			return baseUrl + "posts?" + args.replace('slug=', 'tag=');
		} else if (method == "get_category_posts") {
			return baseUrl + "posts?number=6"; // + args.replace('slug=','category='); 
		} else if (method == "get_author_posts") {
				return baseUrl + "posts?" + args.replace('slug=', 'author=');
			} else if (method == "get_archive") {
				return baseUrl + "posts?" + args.replace('slug=', 'author=');
			}
	};
	data.getPosts = function (page) {
		return api.posts();
	};
	// get data taxonomies
	data.getPostsTaxonamy = function (type, slug, page) {
		if (type == 'console') {
			return $http({
				method: 'GET', url: wpBuildUrl("get_tag_posts", 'page=' + page + '&slug=' + slug)
			});
		} else if (type == 'category') {
			return $http({
				method: 'GET', url: wpBuildUrl("get_category_posts", 'page=' + page + '&slug=' + slug)
			});
		} else if (type == 'author') {
			return $http({
				method: 'GET', url: wpBuildUrl('get_author_posts', 'page=' + page + '&slug=' + slug)
			});
		} else if (type == 'archive') {
			return $http({
				method: 'GET', url: wpBuildUrl('get_date_posts', 'page=' + page + '&date=' + slug)
			});
		}
	};
	// get all categories
	data.searchPosts = function (page, searchTerm) {
		return $http({
			method: 'GET', url: wpBuildUrl('get_search_results', 'page=' + page + '&search=' + searchTerm)
		});
	};
	// get all categories
	data.getCategories = function () {
		return $http({
			method: 'GET', url: wpBuildUrl('get_category_index')
		});
	};
	// get all tags
	data.getTags = function () {
		return $http({
			method: 'GET', url: wpBuildUrl('get_tag_index')
		});
	};
	// get all authors
	data.getAuthors = function () {
		return $http({
			method: 'GET', url: wpBuildUrl('get_author_index')
		});
	};
	// monthly archives
	data.getDates = function () {
		return $http({
			method: 'GET', url: wpBuildUrl('get_date_index')
		});
	};
	// get all categories
	data.getPotsCats = function (slug) {
		return api.posts({ count: 10 });
	};
	return data;
}]);
app.factory('WordPressComent', ['$http', 'Config', function ($http, Config) {
	var WordPressComent = {};
	WordPressComent.addComment = function (postId, name, email, url, content) {
		var data = "";
		data = 'post_id=' + postId + '&name=' + name + '&email=' + email;
		data += '&url=' + url + '&content=' + content;
		return $http({
			method: 'GET',
			url: wpBuildUrl('respond_submit_comment', data)
		});
	};

	return WordPressComent;
}]);
app.factory('globalFactory', [function () {
	return {
		// get first image or feed
		getPostImageFeed: function (postContent) {
			var div = document.createElement('div');
			div.innerHTML = postContent;
			var img = div.getElementsByTagName("img");
			var iframe = div.getElementsByTagName("iframe");
			if (img.length >= 1) {
				imgthumb = img[0].src;
				return imgthumb;
			} else if (iframe.length >= 1) {
				iframeVideo = iframe[0].src;
				var re = /(\?v=|\/\d\/|\/embed\/)([a-zA-Z0-9\-\_]+)/;
				videokeynum = iframeVideo.match(re);
				if (videokeynum) {
					videokey = iframeVideo.match(re)[2];
					imageurl = 'http://i2.ytimg.com/vi/' + videokey + '/0.jpg';
					return imageurl;
				}
			}
		},
		getDateData: function (dt) {
			var dates = {
				'01': 'January',
				'02': 'February',
				'03': 'March',
				'04': 'April',
				'05': 'May',
				'06': 'June',
				'07': 'July',
				'08': 'August',
				'09': 'September',
				'10': 'October',
				'11': 'November',
				'12': 'December'
			};
			return dates[dt];
		}
	};
}]);
app.factory('HomePageCats', [function () {
	var data = {};

	data.items = [{
		title: 'Featured',
		slug: 'slider'
	}];

	return data;
}]);