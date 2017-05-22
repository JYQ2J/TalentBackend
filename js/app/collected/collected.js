app.controller('CollectedCtrl', ['$scope', '$http', 'toaster', '$cookies', '$stateParams',
    function ($scope, $http, toaster, $cookies, $stateParams) {

        var lessonId = document.cookie.split(";")[1];
        console.log(lessonId);
        var user_token = $cookies.user_token;
        var url = $scope.app.url;
        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.itemsPerPage = 20;
        $scope.totalItems = 300;
        $scope.status = "加载中";

        $scope.lessID = lessonId;
        $scope.users = [];

        //请求课程数据
        $scope.search = function (type) {

            if(type == 1){
                $scope.currentPage = 1;
            }
            $scope.status = "加载中";
            var params = "";
            //查分类
            params += "less_id=" + $scope.lessID;

            $http({
                "method": "get",
                "url": url + "/v2.1/lession/collections/"+params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                alert(json);
                $scope.status = "加载完成";
                $scope.numbers = json.pagination.total_rows;
                $scope.capacity = json.pagination.capacity;

                $scope.users = json.users;
                var total = json.pagin
                ation.total;
                var pages = [];
                total = total > 20 ? 20 : total;
                for(var i=1; i<=total; i++){
                    pages.push(i);
                }
                $scope.displayNum = pages;
                $scope.totalPage = total;
            })
                .error(function () {
                    toaster.pop("warning", "加载出错!", "", 1500);
                });
        }
        $scope.search(0);

        //搜索框回车响应
        $scope.enterKeyPress = function(event){
            if(event.keyCode===13){
                $scope.search(1);
            }
        }

        //翻页
        $("#page_navigation").bind("click",function(obj){
            var page = obj.target.innerText;
            if(page == "prev"){
                if($scope.currentPage > 1){
                    $scope.currentPage = $scope.currentPage - 1;
                    $scope.search(0);
                }else{
                    alert("已经是第一页");
                }
            }else if(page == "next"){
                if($scope.currentPage < $scope.totalPage){
                    $scope.currentPage = $scope.currentPage + 1;
                    $scope.search(0);
                }else{
                    alert("已经是最后一页");
                }
            }else{
                $scope.currentPage = page;
                $scope.search(0);
            }
        });

    }]);
