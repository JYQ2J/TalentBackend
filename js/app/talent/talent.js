/**
 * 待审核
 */
app.controller('TalenttocheckCtrl', ["$scope", "$cookies", 'toaster', '$http',
    function ($scope, $cookies, toaster, $http) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.itemsPerPage = 20;
    $scope.totalItems = 300;
    $scope.status = "加载中";

    $scope.nameSearch = "";
    $scope.startTime = "";
    $scope.endTime = "";
    $scope.catas = [];
    $scope.images = [];//证书图片
    $scope.masters = [];

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
        params += "state=pending";
        params += "&cata_id=0";
        params += "&start_time=" + $scope.startTime;
        params += "&end_time=" + $scope.endTime;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;
        $http({
                "method": "get",
                "url": url + "/v1.0/admin/masters?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.masters = json.masters;
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
            var all = {"id" : "0","name" : "全部","icon" : ""};
            $scope.catalogs.unshift(all);
        })
        .error(function (data, status, hedaers, config) {
        });
    }
    $scope.getCatalogList();

    //点击表格行事件
    $('#dataTableCommonID').bind('click',
        function (e) {
            var masters = $scope.masters;
            var row = e.target.parentElement.children;
            row = findCourse(masters, row[0].innerText);

            $("#info-change-id").val(row.id);
            $("#info-change-name").val(row.name);
            $("#info-change-phone").val(row.phone);
            $("#info-change-tag").val(row.tag);
            $("#info-change-cata_id").val(row.cata_id);
            $("#info-change-want_cata").val(row.want_cata);
            $("#info-change-resume").val(row.resume);
            $("#info-change-glory").val(row.glory);
            $("#info-change-state").val("normal");

            //获取证书图片
            $http({
                method: 'GET',
                url: url + "/v1.0/admin/master/" + $("#info-change-id").val(),
                headers: { 'access_token': user_token}
            })
            .success(function (data, status) {
                $scope.images = data.cers;
            })
            .error(function (data, status, hedaers, config) {
                toaster.pop("error", "获取证书失败!", "", 1500);
            });
            
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
        if($("#info-change-cata_id").val() == null){
            alert("类型不能为空");
            return 0;
        }
        if($("#info-change-state").val() == null){
            alert("评判不能为空");
            return 0;
        }

        var data = {
            "tags": $("#info-change-tag").val(),
            "cata_id": $("#info-change-cata_id").val(),
            "resume": $("#info-change-resume").val(),
            "glory": $("#info-change-glory").val(),
            "state": $("#info-change-state").val()
        };
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/master/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("保存成功");
                    $scope.search(0);
                    $scope.closeInfoChangePage();
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("保存失败");
            }
        });
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

    //私有函数，查对应id的所有信息
    function findCourse(datas, id){
        for(var i=0; i<datas.length; i++){
            if(id == datas[i].id){
                return datas[i];
            }
        }
    }

    //翻页
    $scope.paginationClick = function(){
        $scope.search(0);
    };
}]);


//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
/* 已上架 and 已下架 and 被拒*/
app.controller('TalentCtrl', ["$scope", "$cookies", 'toaster', '$http',
    function ($scope, $cookies, toaster, $http) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.itemsPerPage = 20;
    $scope.totalItems = 300;
    $scope.status = "加载中";

    $scope.categorySelected = "0";
    $scope.stateSelected = "normal";
    $scope.nameSearch = "";
    $scope.startTime = "";
    $scope.endTime = "";
    $scope.catas = [];
    $scope.catalogs;
    $scope.masters = [];

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
        params += "state=" + $scope.stateSelected;
        params += "&cata_id=" + $scope.categorySelected;
        params += "&start_time=" + $scope.startTime;
        params += "&end_time=" + $scope.endTime;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;
        $http({
                "method": "get",
                "url": url + "/v1.0/admin/masters?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.masters = json.masters;
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
            var all = {"id" : "0","name" : "全部","icon" : ""};
            $scope.catalogs.unshift(all);
        })
        .error(function (data, status, hedaers, config) {
        });
    }
    $scope.getCatalogList();

    //点击表格行事件
    $('#dataTableCommonID').bind('click',
        function (e) {
            var masters = $scope.masters;
            var row = e.target.parentElement.children;
            row = findCourse(masters, row[0].innerText);

            $("#info-change-id").val(row.id);
            $("#info-change-name").val(row.name);
            $("#info-change-phone").val(row.phone);
            $("#info-change-tag").val(row.tag);
            $("#info-change-cata_id").val(row.cata_id);
            $("#info-change-want_cata").val(row.want_cata);
            $("#info-change-resume").val(row.resume);
            $("#info-change-glory").val(row.glory);
            $("#info-change-state").val(row.state);

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
            "tags": $("#info-change-tag").val(),
            "cata_id": $("#info-change-cata_id").val(),
            "resume": $("#info-change-resume").val(),
            "glory": $("#info-change-glory").val(),
            "state": $("#info-change-state").val()
        };
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/master/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("保存成功");
                    $scope.search(0);
                    $scope.closeInfoChangePage();
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("保存失败");
            }
        });
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

    //私有函数，查对应id的所有信息
    function findCourse(datas, id){
        for(var i=0; i<datas.length; i++){
            if(id == datas[i].id){
                return datas[i];
            }
        }
    }

    //翻页
    $scope.paginationClick = function(){
        $scope.search(0);
    };
}]);


//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
/* 信息修改审核*/
app.controller('TalentChangeinfoCtrl',["$scope", "$cookies", 'toaster', '$http',
    function ($scope, $cookies, toaster, $http) {
        
    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.itemsPerPage = 20;
    $scope.totalItems = 300;
    $scope.status = "加载中";

    $scope.masters = [];
    $scope.images = [];

    //请求用户数据
    $scope.search = function (type) {
        //判断是否是搜索
        if(type == 1){
            $scope.currentPage = 1;
        }

        $scope.status = "加载中";
        $http({
                "method": "get",
                "url": url + "/v1.0/admin/master/updates",
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.masters = json.result;
                $scope.totalItems = json.pagination.total_rows;
            })
            .error(function () {
                toaster.pop("warning", "加载出错!", "", 1500);
            });
    }
    $scope.search(0);

    //点击表格行事件
    $('#dataTableCommonID').bind('click',
        function (e) {
            var masters = $scope.masters;
            var row = e.target.parentElement.children;
            row = findCourse(masters, row[0].innerText);

            $("#info-change-id").val(row.id);
            $("#info-change-name").val(row.name);
            $("#info-change-tag").val(row.tags);
            $("#info-change-resume").val(row.resume);
            $("#info-change-glory").val(row.glory);
            $scope.images = row.certificates;
            $scope.$apply(function(){});

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

    $scope.decideYesNo = function (type) {
        var type = type == 1 ? "yes" : "no";
        $.ajax({
            "type": "put",
            "data": JSON.stringify({
                "confirm": type
            }),
            "url": url + "/v1.0/admin/master/update/" + $("#info-change-id").val(),
            "headers": {
                "access_token": user_token
            },
            "success": function (json) {
                if(json.state == "ok"){
                    alert("操作成功");
                    $scope.search(0);
                    $scope.closeInfoChangePage();
                }
            },
            "error": function(info){
                alert("异常错误，操作未成功。");
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

    //翻页
    $scope.paginationClick = function(){
        $scope.search(0);
    };
}]);