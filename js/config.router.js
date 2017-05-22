'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
    ['$rootScope', '$state', '$stateParams', '$templateCache',
      function ($rootScope, $state, $stateParams, $templateCache) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
      }
    ]
    )
    .config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/access/signin');
                $stateProvider

                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: 'tpl/app.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['js/controllers/header.js']);
                        }]
                    }
                })
                
                .state('app.user', {
                    url: '/user',
                    templateUrl: 'tpl/app/user/user.html',
                    resolve: {deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function () {
                                        return $ocLazyLoad.load(['js/controllers/toaster.js',
                                            'js/app/user/user.js']);
                                    });}]
                    }
                })
////////////////////////////////////////////////////////////////////////////////////////
                .state('app.talent', {
                    url: "/talent",
                    template: '<div ui-view></div>',
                    resolve: {
                        deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function () {
                                    return $ocLazyLoad.load(['js/app/talent/talent.js']);
                                });}]
                    }
                })
                .state('app.talent.tocheckList', {
                    url: '/tocheck',
                    templateUrl: 'tpl/app/talent/talent.tocheck.html'
                })
                .state('app.talent.all', {
                    url: '/all',
                    templateUrl: 'tpl/app/talent/talent.all.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('toaster');
                            }]}
                })
                .state('app.talent.infochange',{
                    url:'/infochange',
                    templateUrl:'tpl/app/talent/talent.infochange.html',
                    cache:'false',
                })
////////////////////////////////////////////////////////////////////////////////////////
                .state('app.course', {
                    url: '/course',
                    template: '<div ui-view></div>',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function () {
                                    return $ocLazyLoad.load(['js/app/course/course.js'])
                                }
                            );}]}
                })
                .state('app.course.all', {
                    url: '/all',
                    templateUrl: 'tpl/app/course/course.all.html'
                })
                .state('app.course.recommend', {
                    url: '/recommend',
                    templateUrl: 'tpl/app/course/course.recommend.html'
                })
                .state('app.course.experience', {
                    url: '/experience',
                    templateUrl: 'tpl/app/course/course.experience.html'
                })
                .state('app.course.normal', {
                    url: '/normal',
                    templateUrl: 'tpl/app/course/course.normal.html'
                })

//////////////////////////////////////////////////////////////////////////////////////////////
                .state('app.ordermng', {
                        url: '/ordermng',
                        templateUrl: 'tpl/app/order/ordermng.html',
                        resolve: {deps: ['$ocLazyLoad',
                                 function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('toaster').then(
                                        function () {
                                            return $ocLazyLoad.load('js/app/ordermng/ordermng.js');
                                        }
                                    );
                        }]}
                })
//////////////////////////////////////////////////////////////////////////////////////////////
                    .state('app.collected', {
                        url: '/collected',
                        templateUrl: 'tpl/app/collected/collected.html',
                        resolve: {deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function () {
                                        return $ocLazyLoad.load('js/app/collected/collected.js');
                                    }
                                );
                            }]}
                    })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                .state('app.classification', {
                    url: '/classification',
                    template: '<div ui-view></div>'
                })
                .state('app.classification.list', {
                        url: '/list',
                        templateUrl: 'tpl/app/classification/classification.list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['vendor/thirdparty/plupload-2.1.8/js/plupload.full.min.js',
                                        'js/app/classification/qiniu.js',
                                        'js/app/classification/classification.js']);
                            }]
                        }
                })
//////////////////////////////////////////////////////////////////////////////////////////////
                .state('app.banner', {
                        url: '/banner',
                        templateUrl: 'tpl/app/banner/banner.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/app/banner/banner.js']);
                            }]
                        }
                })
////////////////////////////////////////////////////////////////////////////////////////////                
                .state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                .state('access.signin', {
                    url: '/signin',
                    templateUrl: 'tpl/page_signin.html',
                    resolve: {
                        deps: ['uiLoad',
                    function (uiLoad) {
                                return uiLoad.load(['js/controllers/signin.js']);
                  }]
                    }
                })
                .state('access.signup', {
                    url: '/signup',
                    templateUrl: 'tpl/page_signup.html',
                    resolve: {
                        deps: ['uiLoad',
                    function (uiLoad) {
                                return uiLoad.load(['js/controllers/signup.js']);
                  }]
                    }
                })
                .state('access.forgotpwd', {
                    url: '/forgotpwd',
                    templateUrl: 'tpl/page_forgotpwd.html'
                })
                .state('access.404', {
                    url: '/404',
                    templateUrl: 'tpl/page_404.html'
                })

      }
    ]
);
