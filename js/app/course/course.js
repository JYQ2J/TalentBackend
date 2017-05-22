app.controller('CourseAllCtrl', ['$scope', '$http', 'toaster', '$cookies',
    function ($scope, $http, toaster, $cookies) {
    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.totalPage = 13;
    $scope.displayNum = [];
    $scope.currentPage = 1;
    $scope.numbers = 1;
    $scope.capacity = 1;

    $scope.categorySelected = 'all';
    $scope.stateSelected = 'all';
    $scope.sortRuleSelected = "time";
    $scope.sortWaySelected = "desc";
    $scope.nameSearch = "";
    $scope.catalogs;
    $scope.catas = [];//详情类型
    $scope.courses = [];

    //请求课程数据
    $scope.search = function (type) {
        if(type == 1){
            $scope.currentPage = 1;
        }
        $scope.status = "加载中";
        var params = "";
        //查分类
        params += "course_type=3";
        if($scope.categorySelected != "all"){
            params += "&cata_id=" + $scope.categorySelected;
        }else{
            params += "&cata_id=0";
        }
        params += "&state=" + $scope.stateSelected;
        params += "&order_by=" + $scope.sortRuleSelected;
        params += "&order=" + $scope.sortWaySelected;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;

        $http({
                "method": "get",
                "url": url + "/v1.0/admin/lessons?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.numbers = json.pagination.total_rows;
                $scope.capacity = json.pagination.capacity;

                $scope.courses = json.lessons;
                var total = json.pagination.total;
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
            $scope.catalogs.unshift(all);
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
            $("#info-change-is_recommend").val(row.is_recommend == 0 ? "否" : "是");
            $("#info-change-is_experience").val(row.is_experience == 0 ? "否" : "是");

            document.cookie = row.id;
            /*
            $scope.showCollection = function () {
                $state.go('app.collected', {lessonId: lessId});
                console.log(lessonId);
            };
            */
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
            "state": $("#info-change-state").val()
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
                    $scope.closeInfoChangePage();
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

    //设置为体验课或推荐课
    $scope.setLessonType = function(type){
        var data;
        if(type == "recommend"){
            data = {"is_recommend": 1};
        }else if(type == "experience"){
            data = {"is_experience": 1};
        }

        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/lessons/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("设置成功");
                    $scope.closeInfoChangePage();
                    $scope.search(0);
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("设置失败");
            }
        });
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller('CourseRecommendCtrl', ['$scope', '$http', 'toaster', '$cookies', 
    function ($scope, $http, toaster, $cookies) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.totalPage = 13;
    $scope.displayNum = [];
    $scope.currentPage = 1;
    $scope.numbers = 1;
    $scope.capacity = 1;

    $scope.categorySelected = 'all';
    $scope.stateSelected = 'all';
    $scope.sortRuleSelected = "time";
    $scope.sortWaySelected = "desc";
    $scope.nameSearch = "";
    $scope.catalogs;
    $scope.catas = [];//详情类型
    $scope.courses = [];

    $scope.rowObject;

    //请求课程数据
    $scope.search = function (type) {
        if(type == 1){
            $scope.currentPage = 1;
        }
        $scope.status = "加载中";
        var params = "";
        //查分类
        params += "course_type=1";
        if($scope.categorySelected != "all"){
            params += "&cata_id=" + $scope.categorySelected;
        }else{
            params += "&cata_id=0";
        }
        params += "&state=" + $scope.stateSelected;
        params += "&order_by=" + $scope.sortRuleSelected;
        params += "&order=" + $scope.sortWaySelected;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;

        $http({
                "method": "get",
                "url": url + "/v1.0/admin/lessons?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.numbers = json.pagination.total_rows;
                $scope.capacity = json.pagination.capacity;

                $scope.courses = json.lessons;
                var total = json.pagination.total;
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
            $scope.catalogs.unshift(all);
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
            $scope.rowObject = e.target.parentElement;
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
            $("#info-change-is_recommend").val(row.is_recommend == 0 ? "否" : "是");
            $("#info-change-is_experience").val(row.is_experience == 0 ? "否" : "是");

            document.cookie = row.id;

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
            "score": $("#info-change-score").val(),
            "action_type": "recommend"
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
                    $scope.closeInfoChangePage();
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

    //删除推荐课
    $scope.deleteRecommend = function(type){
        var data = {"is_recommend": 0};
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/lessons/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("删除成功");
                    $scope.rowObject.remove();
                    $scope.closeInfoChangePage();
                } else {
                    toaster.pop("success", "删除失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("删除失败");
            }
        });
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller('CourseExperienceCtrl', ['$scope', '$http', 'toaster', '$cookies', 
    function ($scope, $http, toaster, $cookies) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.totalPage = 13;
    $scope.displayNum = [];
    $scope.currentPage = 1;
    $scope.numbers = 1;
    $scope.capacity = 1;

    $scope.categorySelected = 'all';
    $scope.stateSelected = 'all';
    $scope.sortRuleSelected = "time";
    $scope.sortWaySelected = "desc";
    $scope.nameSearch = "";
    $scope.catalogs;
    $scope.catas = [];//详情类型
    $scope.courses = [];

    $scope.rowObject;

    //请求课程数据
    $scope.search = function (type) {
        if(type == 1){
            $scope.currentPage = 1;
        }
        $scope.status = "加载中";
        var params = "";
        //查分类
        params += "course_type=0";
        if($scope.categorySelected != "all"){
            params += "&cata_id=" + $scope.categorySelected;
        }else{
            params += "&cata_id=0";
        }
        params += "&state=" + $scope.stateSelected;
        params += "&order_by=" + $scope.sortRuleSelected;
        params += "&order=" + $scope.sortWaySelected;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;

        $http({
                "method": "get",
                "url": url + "/v1.0/admin/lessons?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.numbers = json.pagination.total_rows;
                $scope.capacity = json.pagination.capacity;

                $scope.courses = json.lessons;
                var total = json.pagination.total;
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
            $scope.catalogs.unshift(all);
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
            $scope.rowObject = e.target.parentElement;
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
            $("#info-change-is_recommend").val(row.is_recommend == 0 ? "否" : "是");
            $("#info-change-is_experience").val(row.is_experience == 0 ? "否" : "是");

            document.cookie = row.id;

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
            "score": $("#info-change-score").val(),
            "action_type": "experience"
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
                    $scope.closeInfoChangePage();
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

    //删除体验课
    $scope.deleteRecommend = function(type){
        var data = {"is_experience": 0};
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/lessons/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("删除成功");
                    $scope.rowObject.remove();
                    $scope.closeInfoChangePage();
                } else {
                    toaster.pop("success", "删除失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("删除失败");
            }
        });
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


//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller('CourseNormalCtrl', ['$scope', '$http', 'toaster', '$cookies', 
    function ($scope, $http, toaster, $cookies) {

    var user_token = $cookies.user_token;
    var url = $scope.app.url;
    $scope.totalPage = 13;
    $scope.displayNum = [];
    $scope.currentPage = 1;
    $scope.numbers = 1;
    $scope.capacity = 1;

    $scope.categorySelected = 'all';
    $scope.stateSelected = 'on';
    $scope.sortRuleSelected = "time";
    $scope.sortWaySelected = "desc";
    $scope.nameSearch = "";
    $scope.catalogs;
    $scope.catas = [];//详情类型
    $scope.courses = [];

    //请求课程数据
    $scope.search = function (type) {
        if(type == 1){
            $scope.currentPage = 1;
        }
        $scope.status = "加载中";
        var params = "";
        //查分类
        params += "course_type=2";
        if($scope.categorySelected != "all"){
            params += "&cata_id=" + $scope.categorySelected;
        }else{
            params += "&cata_id=0";
        }
        params += "&state=" + $scope.stateSelected;
        params += "&order_by=" + $scope.sortRuleSelected;
        params += "&order=" + $scope.sortWaySelected;
        params += "&name=" + $scope.nameSearch;
        params += "&page=" + $scope.currentPage;

        $http({
                "method": "get",
                "url": url + "/v1.0/admin/lessons?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.numbers = json.pagination.total_rows;
                $scope.capacity = json.pagination.capacity;

                $scope.courses = json.lessons;
                var total = json.pagination.total;
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
            $scope.catalogs.unshift(all);
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
            $("#info-change-is_recommend").val(row.is_recommend == 0 ? "否" : "是");
            $("#info-change-is_experience").val(row.is_experience == 0 ? "否" : "是");

            document.cookie = row.id;

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
            "description": $("#info-change-description").val(),
            "keeptime": $("#info-change-keeptime").val(),
            "less_name": $("#info-change-less_name").val(),
            "price": $("#info-change-price").val() * 100,
            "score": $("#info-change-score").val(),
            "state": $("#info-change-state").val(),
            "cata_id": $("#info-change-cata_id").val(),
            "action_type": "normal"
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
                    $scope.closeInfoChangePage();
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

    //设置为体验课或推荐课
    $scope.setLessonType = function(type){
        var data;
        if(type == "recommend"){
            data = {"is_recommend": 1};
        }else if(type == "experience"){
            data = {"is_experience": 1};
        }
        
        $.ajax({
            "type": "put",
            "dataType": "json",
            "url": url + "/v1.0/admin/lessons/" + $("#info-change-id").val(),
            "data": JSON.stringify(data),
            "headers": {"access_token": user_token},
            "success": function (data, info) {
                if (data.state == "ok") {
                    alert("设置成功");
                    $scope.closeInfoChangePage();
                    $scope.search(0);
                } else {
                    toaster.pop("success", "保存失败!", "", 1500);
                }
            },
            "error": function(data){
                alert("设置失败");
            }
        });
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