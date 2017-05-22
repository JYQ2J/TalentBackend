app.controller('userCtrl', ['$scope', '$http', 'toaster', '$cookies', 
    function ($scope, $http, toaster, $cookies) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.itemsPerPage = 20;
    $scope.totalItems = 300;
    $scope.status = "加载中";

    $scope.stateSelected = 'all';
    $scope.startTime = "";
    $scope.endTime = "";
    $scope.nameSearch = "";
    $scope.users = [];

    //请求用户数据
    $scope.search = function (type) {
        //判断时间
        if(!startEndTimeRight($scope.startTime, $scope.endTime)){
            return 0;
        }
        //判断是否是搜索
        if(type == 1){
            $scope.currentPage = 1;
        }

        $scope.status = "加载中";
        var params = "";
        params += "authority=" + $scope.stateSelected;
        params += "&start_time=" + $scope.startTime;
        params += "&end_time=" + $scope.endTime;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;
        $http({
                "method": "get",
                "url": url + "/v1.0/admin/users?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.users = json.users;
                $scope.totalItems = json.pagination.total_rows;
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

    //点击表格行事件
    $('#dataTableCommonID').bind('click',
        function (e) {
            var users = $scope.users;
            var row = e.target.parentElement.children;
            row = findCourse(users, row[0].innerText);

            $("#info-change-id").val(row.id);
            $("#info-change-name").val(row.name);
            $("#info-change-authority").val(row.authority);

            $("#infoChangePage").addClass("fadeInRight");
            $("#infoChangePage").removeClass("hide fadeOutRight"); 
            $("#infoChangePage").css("z-index","100");
        }
    );

    //关闭信息修改界面
    $scope.closeInfoChangePage = function(){
        $("#infoChangePage").removeClass("fadeInRight");
        $("#infoChangePage").addClass("hide fadeOutRight");
        $("#infoChangePage").css("z-index","-1");
    }

    //保存修改的用户信息
    $scope.saveInfoChangePage = function(){
        var data = {
            "authority": $("#info-change-authority").val()
        };
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/users/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("保存成功");
                    $scope.search(0);
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("保存失败");
            }
        });
    }

    //私有函数，查对应id的所有信息
    function findCourse(datas, id){
        for(var i=0; i<datas.length; i++){
            if(id == datas[i].id){
                return datas[i];
            }
        }
    }

    //私有函数，判断时间是否正确
    function startEndTimeRight(start, end){
        if(start != "" && !isDateTime(start)){
            alert("起始时间格式错误");
            return false;
        }
        if(end != "" && !isDateTime(end)){
            alert("截止时间格式错误");
            return false;
        }
        if(end < start){
            alert("时间格式错误，起始时间大于截止时间");
            return false;
        }
        return true;
    }

    //私有函数，格式化时间
    function isDateTime(str){
        var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/; 
        var r = str.match(reg); 
        if(r==null)return false;
        return true;
    }

    //翻页
    $scope.paginationClick = function(){
        $scope.search(0);
    };
}])