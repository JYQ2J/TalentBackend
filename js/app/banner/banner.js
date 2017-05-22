app.controller('BannerCtrl', ['$scope','$http','$cookies', function ($scope, $http,$cookies) {
    //empty
    var user_token = $cookies.user_token;
    var URL = $scope.app.url;

    $scope.banners = [{id:1, image:"img/p0.jpg", url:"www.baidu.com"}];
    $scope.pageSelected = "index";

    $scope.getBanners = function(){
        $http({
            method  : 'GET',
            url     : URL + "/v2.0/banners?type=" + $scope.pageSelected
        })
        .success(function(data,status,config,headers){
            $scope.banners = data.banners;
        })
        .error(function(data,status,hedaers,config){
            //处理失败后的响应
        });
    }
    $scope.getBanners();

    $scope.addBanner = function(){
        var data = {id:-1, image:"img/p0.jpg", url:"添加URL,不跳转填空"};
        $scope.banners.push(data);
    }
    
    $scope.deleBanner = function(id){
        if(id == -1){
            $scope.banners.pop();
            return 0;
        }
        if(confirm("确定删除吗？")){
            $.ajax({
                type  : 'delete',
                url     : URL + '/v2.0/banner/' + id,
                crossDomain : true,
                headers : {'access_token': user_token},
                success : function(state){
                    $scope.getBanners();
                },
                error : function(data){
                    alert("error");   
                }
            });
        }
    }

    $scope.saveBanner = function(id){
        $.ajax({
            type    :  "post",
            url     :  URL + "/v1.0/static/token",
            headers : {'access_token': user_token},
            success :   function(json){
                $scope.uploadUtil(id, json.token, json.key);
            }
        })
    }
    
    
    $scope.submitNewBanner = function(url, image) {
        $.ajax({
            method  : 'post',
            url     : URL + '/v2.0/banner',
            crossDomain : true,
            data  : JSON.stringify({
                "image": image,
                "url": url,
                "type": $scope.pageSelected
            }),
            headers : {'access_token': user_token},
            success : function(data){
                $scope.getBanners();
            },
            error : function(data){
                alert("error")   
            }
            
        })
    }

    $scope.uploadUtil = function(id, token, key){
        var Qiniu_upload = function(id, f, token, key) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "https://up.qbox.me", true);
            var formData = new FormData();
            formData.append('key', key);
            formData.append('token', token);
            formData.append('file', f);

            xhr.onreadystatechange = function(response,data,info,jj) {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                    var blkRet = JSON.parse(xhr.responseText);
                    $scope.submitNewBanner($(".name"+id).val(), blkRet.key);
                } else if (xhr.status != 200 && xhr.responseText) {
                    //alert("网络错误");
                }
            };
            xhr.send(formData);
        };
        if ($("#fileInput"+id)[0].files.length > 0) {
            Qiniu_upload(id, $("#fileInput"+id)[0].files[0], token, key);
        } else {
            alert("没有选择一张新图片（若要更新，请新建banner，删除旧banner）");
        }
    }

    $scope.clickImg = function(id){
        $("#fileInput"+id).click();
        $("#fileInput"+id).on("change", function(){
            $("#img"+id)[0].src = getObjectURL($("#fileInput"+id)[0].files[0]);
            $('#saveBt'+id).show();
        });
    }

    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) {
           url = window.createObjectURL(file)
        } else if (window.URL != undefined) {
           url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
           url = window.webkitURL.createObjectURL(file)
        }
        return url
    };

}]);

function nameChange(obj){
    var id = ($(obj).attr("class")).substr(4);
    $('#saveBt'+id).show();
}

