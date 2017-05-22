'use strict';

app.controller('OrderCtrl', ["$scope", "$cookies", 'toaster', '$http',
    function ($scope, $cookies, toaster, $http) {

        var user_token = $cookies.user_token;
        var url = $scope.app.url;
        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.itemsPerPage = 20;
        $scope.totalItems = 300;
        $scope.status = "加载中";

        $scope.stateSelected = "999";
        $scope.archivedSelected = "2";
        $scope.nameSearch = "";
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.orderBy = "time";
        $scope.orders = [];

        //请求用户数据
        $scope.search = function (type) {
            //判断时间
            if (!startEndTimeRight($scope.startTime, $scope.endTime)) {
                return 0;
            }
            //判断是否是搜索
            if (type == 1) {
                $scope.currentPage = 1;
            }

            $scope.status = "加载中";
            var params = "";
            params += "state=" + $scope.stateSelected;
            params += "&start_time=" + $scope.startTime;
            params += "&end_time=" + $scope.endTime;
            params += "&name=" + $scope.nameSearch;
            params += "&order_by=" + $scope.orderBy;
            params += "&page=" + $scope.currentPage;
            params += "&archived=" + $scope.archivedSelected;

            $http({
                "method": "get",
                "url": url + "/v1.0/admin/orders?" + params,
                "headers": {
                    "access_token": user_token
                }
            }).success(function (json) {
                $scope.status = "加载完成";
                $scope.orders = json.orders;
                $scope.totalItems = json.pagination.total_rows;
            })
                .error(function () {
                    toaster.pop("warning", "加载出错!", "", 1500);
                });
        }
        $scope.search(0);

        //搜索框回车响应
        $scope.enterKeyPress = function (event) {
            if (event.keyCode === 13) {
                $scope.search(1);
            }
        }

        //转换订单状态从数字到文字
        $scope.transState = function (state) {
            switch (state) {
                case -1:
                    return "退款";
                case 0:
                    return "取消";
                case 1:
                    return "待确认";
                case 2:
                    return "已预约";
                case 3:
                    return "已付款";
                case 4:
                    return "已完成";
                default:
                    return "";
            }
        }

    //点击表格行事件
    $('#dataTableCommonID').bind('click',
        function (e) {
            var orders = $scope.orders;
            var row = e.target.parentElement.children;
            row = findCourse(orders, row[0].innerText);

            $("#info-change-id").val(row.id);
            $("#info-change-name").val(row.name);
            $("#info-change-time").val(row.time);
            $("#info-change-confirm_time").val(row.confirm_time);
            $("#info-change-pay_time").val(row.pay_time);
            $("#info-change-finish_time").val(row.finish_time);
            $("#info-change-refund_time").val(row.refund_time);
            $("#info-change-cancel_time").val(row.cancel_time);
            $("#info-change-cancel_remark").val(row.remark);
            $("#info-change-archived").val(row.archived);

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

        //修改归档情况 *****************************
        $scope.setArchived = function(type){
            var data;
            if(type == "is_archived"){
                data = {"archived": 1};
            }
            $.ajax({
                "type": "post",
                "dataType": "json",
                "url": url + "/v2.1/admin/order/archive/" + $("#info-change-id").val(),
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
        $scope.setUnArchived = function(type){
            var data;
            if(type == "is_unarchived"){
                data = {"archived": 0};
            }

            $.ajax({
                "type": "delete",
                "dataType": "json",
                "url": url + "/v2.1/admin/order/archive/" + $("#info-change-id").val(),
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
        //*******************************************

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

    //根据状态显示时间
    $scope.showRightTime = function(order){
        switch(order.state){
            case -1:
                return order.refund_time;
            case 0:
                return order.cancel_time;
            case 1:
                return order.time;
            case 2:
                return order.confirm_time;
            case 3:
                return order.pay_time;
            case 4:
                return order.finish_time;
            default:
                return "";
        }
    }

        //显示归档情况
        $scope.showArchived = function(archived){
            switch (archived) {
                case 0:
                    return "未归档";
                case 1:
                    return "已归档";
                case 2:
                    return "全部";
                default:
                    return "";
            }
        }

    //翻页
    $scope.paginationClick = function(){
        $scope.search(0);
    };
}]);
