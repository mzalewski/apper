// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('YourApp', ['ionic','ngSanitize', 'ngCordova', 'ngIOS9UIWebViewPatch','angular-cache','offline']);
// not necessary for a web based app // needed for cordova/ phonegap application
app.run(['$ionicPlatform',function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
}]);

app.config(function (CacheFactoryProvider) {
    angular.extend(CacheFactoryProvider.defaults, { maxAge: 150 * 60 * 1000 });
  })
.run(function ($http, CacheFactory) {
  $http.defaults.cache = CacheFactory.createCache('bookCache', {
      deleteOnExpire: 'none',
      maxAge: 60000,
      storageMode: 'localStorage'
    });
});
app.run(['$rootScope', 'globalFactory', function($rootScope, globalFactory) {
	$rootScope.globalFunction = globalFactory;
}]);
// config to disable default ionic navbar back button text and setting a new icon
app.config(['$ionicConfigProvider',function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('Back').icon('ion-ios-arrow-back').previousTitleText(false);
}]);
// main controller file // 
app.controller('WpCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate','Config', function($scope, $state, $ionicSlideBoxDelegate,Config) {
	
	$scope.appColor = Config.Theme;
  	// Toggle left function for app sidebar
  	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
	// sharing plugin
	$scope.shareArticle = function(title,url){
		window.plugins.socialsharing.share(title, null, null, url)
	}
	// open link url
	$scope.openLinkArticle = function(url){
		window.open(url, '_system');
	}
}])
/* home controller -- posts from different categories */
app.controller('WordpressHomeCtrl', ['$scope', 'WordPress', '$state', 'HomePageCats', function($scope, WordPress, $state, HomePageCats) {
	
	// get categories needed to use in app -- change it in factory HomePageCats
	// can unlimited categories
	// recommended 4 to 5 categries for best performance
	$scope.categories = HomePageCats.items;
	// loading icon
	$scope.homePosts = true;
	// items array
	$scope.items = [];
    WordPress.posts().then(function(posts) {
        $scope.items = posts;
        angular.forEach($scope.items, function(item, key) {
                
                item.featured_image_url = WordPress.media().id(item.featured_image).then(function(d) { 
                    if (d.guid != undefined)
                    item.featured_image_url = d.guid.rendered;  
                });
            });
        
    });
	
	// showing selected post
	$scope.showFullPost = function(parent, index){
		WordPress.postSelected = $scope.items[index];
        
		var postId = WordPress.postSelected.id;
		$state.go('wordpress.post',{postId:postId});
	}
}])
/* recent posts controller */
app.controller('WordpressBlogCtrl', ['$scope', 'WordPress', '$state', function($scope, WordPress, $state) {	
	// setting header -- 
	$scope.heading = "WordPress";
	$scope.items = [];
	$scope.times = 1 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getPosts($scope.times)
		.then(function (posts) {
			$scope.items = $scope.items.concat(posts.posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if(posts.posts.length == 0) {
				$scope.postsCompleted = true;
			}
		},function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 1 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	// showing single post
	$scope.showFullPost = function(index){
		WordPress.postSelected = $scope.items[index];
		var postId = WordPress.postSelected.id;
		$state.go('wordpress.post',{postId:postId});
	}
}])
/* category and tags controller */
app.controller('WordpressTaxCtrl', ['$scope', '$state', 'WordPress', '$stateParams', 'globalFactory', function($scope, $state, WordPress, $stateParams, globalFactory) {
	
	$scope.type = $stateParams.type;	
	$scope.slug = $stateParams.slug;
	
	$scope.items = [];
	$scope.times = 1 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getPostsByTaxonomy($scope.type, $scope.slug, $scope.times)
		.then(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if(posts.length == 0) {
				$scope.postsCompleted = true;
			}
		},function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 1 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	// showing full posts
	$scope.showFullPost = function(index){
        
		WordPress.postSelected = $scope.items[index];
        
		var postId = WordPress.postSelected.id;
		$state.go('wordpress.post',{postId:postId});
	}
}])
/* post controller */
app.controller('WordpressPostCtrl', ['$scope', 'WordPress', '$stateParams', '$sce', function($scope, WordPress, $stateParams, $sce) {
	console.log($stateParams);
    
	$scope.postId = $stateParams.postId;
    $scope.post = WordPress.postSelected;
	
	 WordPress.posts().id($stateParams.postId).then(function(post) { 
        if ($scope.post == undefined)
            $scope.post = post;
        $scope.heading = post.title.rendered;
        $scope.allContent = $sce.trustAsHtml(post.content.rendered);
        $scope.user = [];
        post.featured_image_url = WordPress.media().id(post.featured_image).then(function(d) { 
            if (d.guid != undefined)
                    post.featured_image_url = d.guid.rendered; 
            $scope.post = post;  
        });

    });
    if ($scope.post != undefined) { 
        $scope.heading = $scope.post.title.rendered;
        $scope.allContent = $sce.trustAsHtml($scope.post.content.rendered);
    }
}])

app.controller('WordpressPageCtrl', ['$scope', 'WordPress', '$stateParams', '$sce', function($scope, WordPress, $stateParams, $sce) {
	console.log($stateParams);
    
	$scope.pageId = $stateParams.pageId;
    $scope.page = WordPress.pageSelected;
	
	 WordPress.pages().id($stateParams.pageId).then(function(page) { 
         console.log(page);
        if ($scope.page == undefined)
            $scope.page = page;
        $scope.heading = page.title.rendered;
        $scope.allContent = $sce.trustAsHtml(page.content.rendered);
        $scope.user = [];
        page.featured_image_url = WordPress.media().id(page.featured_image).then(function(d) { 
            if (d.guid != undefined)
                    page.featured_image_url = d.guid.rendered; 
            $scope.page = page;  
        });

    });
    if ($scope.page != undefined) { 
        $scope.heading = $scope.page.title.rendered;
        $scope.allContent = $sce.trustAsHtml($scope.page.content.rendered);
    }
}])

/* category and tags controller */
app.controller('WordpressCategoriesCtrl', ['$scope', 'WordPress', function($scope, WordPress) {		
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getCategories()
		.then(function (posts) {
			$scope.items = $scope.items.concat(posts.categories);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		},function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.items = [];
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/* category and tags controller */
app.controller('WordpressTagsCtrl', ['$scope', 'WordPress', function($scope, WordPress) {
		
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getTags()
		.then(function (posts) {
			$scope.items = $scope.items.concat(posts.tags);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		},function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.items = [];
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/* author controller */
app.controller('WordpressAuthorsCtrl', ['$scope', 'WordPress', function($scope, WordPress) {
		
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getAuthors()
		.then(function (posts) {
			$scope.items = $scope.items.concat(posts.authors);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		},function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.items = [];
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/* author controller */
app.controller('WordpressArchivesCtrl', ['$scope', 'WordPress', 'globalFactory', function($scope, WordPress, globalFactory) {
		
	$scope.items = [];
	$scope.postsCompleted = false;
	$scope.dataDates = [];
	// load more content function
	$scope.getPosts = function(){
		WordPress.getDates()
		.then(function (posts) {
			if(posts.status == 'ok'){
				var dataDates = [] ;
				angular.forEach(posts.tree, function(value, key) {
					angular.forEach(value, function(posts, month) {
						var singleDate = {
							archiveslug : key+'-'+month,
							archivedata : key+' '+globalFactory.getDateData(month)+'('+posts+')',
						}
						dataDates.push(singleDate);
					});
				});
				$scope.items = dataDates;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		},function (error) {
			$scope.items = [];
		});
	}
}])
/* category and tags controller */
app.controller('WordpressSearchCtrl', ['$scope', '$state', 'WordPress', '$stateParams','$sce', function($scope, $state, WordPress, $stateParams, $sce) {
	// getting label from params
  	$scope.query = $stateParams.query;
	// setting header same as label
	$scope.MainHeading = $sce.trustAsHtml($scope.query);
	$scope.query = "";
	$scope.posts = [];
	$scope.searchQuery = [];
	$scope.pageToken = 1;
	$scope.postsCompleted = false;
	// get posts function
	$scope.getPosts = function(){
		WordPress.searchPosts($scope.pageToken, $scope.query)
		.then(function (posts) {
			if(posts && posts.length != 0){
				$scope.posts = $scope.posts.concat(posts);
				$scope.pageToken = $scope.pageToken + 1;
				$scope.postsCompleted = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			} else {
				$scope.postsCompleted = true;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		},function (error) {
			$scope.posts = [];
		});
	}
	$scope.searchSubmitFunction = function(){
		$scope.pageToken = 1;
		$scope.posts = [];
		$scope.query = $scope.searchQuery.query;
		$scope.getPosts();
		$scope.MainHeading = $sce.trustAsHtml($scope.query);
	}
	$scope.showFullPost = function(index){
        
		WordPress.postSelected = $scope.posts[index];
        $state.go('wordpress.post');
	}
	//
}])
/* About us Controller */
app.controller('AboutCtrl', ['$scope', function($scope) {
}])
/* Contact us form page */
app.controller('ContactCtrl', ['$scope', 'ConfigContact', '$ionicLoading', '$compile', function($scope, ConfigContact,$ionicLoading, $compile) {
	//setting heading here
	$scope.user = [];
	// contact form submit event
	$scope.submitForm = function(isValid) {
		if (isValid) {
			cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.name+'</h2><br><p>'+$scope.user.details+'</p>',
						isHtml:  true
					});
				}
			);
		}
	}
	function initialize() {
        var myLatlng = new google.maps.LatLng(ConfigContact.Lat,ConfigContact.Lon);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Wellington NZ'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
    }
    if(ConfigContact.Lat && ConfigContact.Lon){
    	google.maps.event.addDomListener(window, 'load', initialize);
    }	
	$scope.clickTest = function() {
		alert('Example of infowindow with ng-click')
	};
}])
// show ad mob here in this page
app.controller('AdmobCtrl', ['$scope', 'ConfigAdmob', function($scope, ConfigAdmob){
	$scope.showInterstitial = function(){
		if(AdMob) AdMob.showInterstitial();
	}
	document.addEventListener("deviceready", function(){
		if(AdMob) {
			// show admob banner
			if(ConfigAdmob.banner) {
				AdMob.createBanner( {
					adId: ConfigAdmob.banner, 
					position: AdMob.AD_POSITION.BOTTOM_CENTER, 
					autoShow: true 
				} );
			}
			// preparing admob interstitial ad
			if(ConfigAdmob.interstitial) {
				AdMob.prepareInterstitial( {
					adId:ConfigAdmob.interstitial, 
					autoShow:false
				} );
			}
		}
		if(ConfigAdmob.interstitial) {
			$scope.showInterstitial();
		}
	});
}]);
app.filter('decode', function() {
    return function(text) {
        return angular.element('<div>' + text + '</div>').text();
    };
});