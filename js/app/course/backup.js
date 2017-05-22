app.controller('CourseAllCtrl', ['$scope', '$http', '$filter', 'toaster', '$cookies', 
    function ($scope, $http, $filter, toaster, $cookies) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.totalPage = 13;
    $scope.displayNum = [];
    $scope.currentPage = 1;

    $scope.categorySelected = 'all';
    $scope.sortRuleSelected = "time";
    $scope.sortWaySelected = "desc";
    $scope.catalogs;
    $scope.catas = [];//详情类型
    $scope.lesson_cata;//详情类型选择
    $scope.courses = [{id:1, mast_name: "jj", less_name: "aa", keeptime: 12, price: 30, score: 12, time: 11}]

    //请求课程数据
    $scope.search = function (type) {
        $scope.status = "加载中";
        var params = "";
        //查分类
        if($scope.categorySelected == 'is_experience'){
            params += "is_experience=1";
        }else if($scope.categorySelected == 'is_recommend'){
            params += "is_recommend=1";
        }else if($scope.categorySelected != "all"){
            params += "cata_id=" + $scope.categorySelected;
        }else{
            params += "cata_id=0";
        }
        
        params += "&order_by=" + $scope.sortRuleSelected;
        params += "&order=" + $scope.sortWaySelected;
        params += "&page=" + $scope.currentPage;

        console.log(params);
        $http({
                "method": "get",
                "url": url + "/v1.0/admin/lessons?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                //debugger
                $scope.status = "加载完成";
                $scope.courses = json.lessons;
                var total = json.pagination.total;
                var pages = [];
                total = total > 20 ? 20 : total;
                for(var i=1; i<=total; i++){
                    pages.push(i);
                }
                $scope.displayNum = pages;
                $scope.totalPage = total;
                if(type == 1){
                    $scope.currentPage = 1;
                }
            })
            .error(function () {
                toaster.pop("warning", "加载出错!", "", 1500);
            });
    }
    $scope.search(0);

    //查询分类列表
    $scope.getCatalogList = function () {
        $http({
            method: 'GET',
            url: url + '/v1.0/catalogs',
            headers: { 'access_token': user_token}
        })
        .success(function (data, status) {
            var length = data.catalogs.length;
            for (var i = 0; i < length; i++) {
                $scope.catas.push(data.catalogs[i]);
            }
            $scope.catalogs = data.catalogs;
            var all = {"id" : 'all',"name" : "全部","icon" : ""};
            var is_experience = {"id" : 'is_experience',"name" : "体验课","icon" : ""};
            var is_recommend = {"id" : 'is_recommend',"name" : "推荐课","icon" : ""};
            $scope.catalogs.unshift(all, is_experience, is_recommend);
        })
        .error(function (data, status, hedaers, config) {
        });
    }
    $scope.getCatalogList();

    //私有函数，从课程里查对应id的所有信息
    $scope.findCourse = function(courses, id){
        for(var i=0; i<courses.length; i++){
            if(id == courses[i].id){
                return courses[i];
            }
        }
    }

    //点击表格行事件
    $('#dataTableCommonID').bind('click',
        function (e) {
            if($("#infoChangePage").hasClass("hide")){
                //预留
            }
            var courses = $scope.courses;
            var row = e.target.parentElement.children;
            row = $scope.findCourse(courses, row[0].innerText);

            $("#info-change-collection_count").val(row.collection_count);
            $("#info-change-description").val(row.description);
            $("#info-change-id").val(row.id);
            $("#info-change-keeptime").val(row.keeptime);
            $("#info-change-less_name").val(row.less_name);
            $("#info-change-mast_id").val(row.mast_id);
            $("#info-change-mast_name").val(row.mast_name);
            $("#info-change-order_processing_count").val(row.order_processing_count);
            $("#info-change-price").val(row.price/100);
            $("#info-change-score").val(row.score);
            $("#info-change-state").val(row.state);
            $("#info-change-cata_id").val(row.cata_id);
            $("#info-change-success_count").val(row.success_count);
            $("#info-change-time").val(row.time);

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
        var action_type;
        if($scope.categorySelected == 'is_recommend'){
            action_type = "recommend";
        }else if($scope.categorySelected == 'is_experience'){
            action_type = "experience";
        }else{
            action_type = "normal";
        }
        var data = {
            "description": $("#info-change-description").val(),
            "keeptime": $("#info-change-keeptime").val(),
            "name": $("#info-change-less_name").val(),
            "price": $("#info-change-price").val() * 100,
            "score": $("#info-change-score").val(),
            "state": $("#info-change-state").val(),
            "cata_id": $("#info-change-cata_id").val(),
            "action_type": action_type
        }
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/lessons/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("保存成功");
                    //toaster.pop("success", "保存成功!", "", 1500);
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("保存失败");
                //toaster.pop("success", "保存失败!", "", 1500);
            }
        });
    }

    $scope.setLessonType = function(type){
        var data = {
            "score": $("#info-change-score").val()
        }
        
        $.ajax({
            "type": "post",
            "dataType": "json",
            "url": url + "/v1.0/admin/lessons/" + type + "/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("设置成功");
                    //toaster.pop("success", "保存成功!", "", 1500);
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("设置失败");
                //toaster.pop("success", "保存失败!", "", 1500);
            }
        });
    }

    //翻页
    $("#page_navigation").bind("click",function(obj){
        //$(".current").attr("style","background-color: #FFFFFF;");
        var page = obj.target.innerText;
        if(page == "prev"){
            if($scope.currentPage > 1){
                $scope.currentPage = $scope.currentPage - 1;
                $scope.search(0);
            }else{
                alert("已经是第一页");
                //toaster.pop("warning", "已经是第一页!", "", 500);
            }
        }else if(page == "next"){
            if($scope.currentPage < $scope.totalPage){
                //$scope.$apply(function() {
                $scope.currentPage = $scope.currentPage + 1;
                //});
                $scope.search(0);
            }else{
                alert("已经是最后一页");
                //toaster.pop("warning", "已经是最后一页!", "", 1500);
            }
        }else{
            //$(obj.target).attr("style","background-color: #23B7E5;");
            $scope.currentPage = page;
            $scope.search(0);    
        }
    });

}])