app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  	//sidebar
    .state('wordpress', {
      url: "/wordpress",
      abstract: true,
      templateUrl: "templates/sidebar-menu.html"
    })
	 // Blog page
	 .state('wordpress.home', {
      url: "/home",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/home.html",
		  		controller: "WordpressHomeCtrl"
        }
      }
    })
	 .state('wordpress.blog', {
      url: "/blog",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/blog.html",
		  		controller: "WordpressBlogCtrl"
        }
      }
    })
	 .state('wordpress.tax', {
      url: "/tax/:type/:slug",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/blog.html",
		  		controller: "WordpressTaxCtrl"
        }
      }
    })
	 // articles page wordpress
	 .state('wordpress.post', {
      url: "/post/:postId",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/post.html",
		  		controller: "WordpressPostCtrl"
        }
      }
    })// articles page wordpress
	 .state('wordpress.page', {
      url: "/page/:pageId",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/page.html",
		  		controller: "WordpressPageCtrl"
        }
      }
    })
	 // categories page wordpress
	 .state('wordpress.categories', {
      url: "/categories",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/categories.html",
		  		controller: "WordpressCategoriesCtrl"
        }
      }
    })
	 // tags page wordpress
	 .state('wordpress.tags', {
      url: "/tags",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/tags.html",
		  		controller: "WordpressTagsCtrl"
        }
      }
    })
	 // tags page wordpress
	 .state('wordpress.authors', {
      url: "/authors",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/authors.html",
		  		controller: "WordpressAuthorsCtrl"
        }
      }
    })
	 // tags page wordpress
	 .state('wordpress.archives', {
      url: "/archives",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/archives.html",
		  		controller: "WordpressArchivesCtrl"
        }
      }
    })
	 // tags page wordpress
	 .state('wordpress.search', {
      url: "/search",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/search.html",
		  		controller: "WordpressSearchCtrl"
        }
      }
    })
	 .state('wordpress.contact', {
      url: "/contact",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/contact.html",
		  		controller: "ContactCtrl"
        }
      }
    })
	 .state('wordpress.about', {
      url: "/about",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/about.html",
		  		controller: "AboutCtrl"
        }
      }
    })
	 .state('wordpress.admob', {
      url: "/admob",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/admob.html",
		  		controller: "AdmobCtrl"
        }
      }
    })
	 //  login page
  	$urlRouterProvider.otherwise("/wordpress/home");
})