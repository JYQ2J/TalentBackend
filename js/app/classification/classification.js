app.controller('ClassificationCtrl', ['$scope','$http','$cookies', function ($scope, $http,$cookies) {
    //empty
    var user_token = $cookies.user_token;
    var url = $scope.app.url;

    $scope.catalogs = [{name:"jjj",id:1,icon:"img/p0.jpg"}];
    $scope.uploadToken = "";
    $scope.uploadKey = "";
    $scope.showSaveBt = false;
    $scope.text = "";

    $scope.upload = function(id){
        $.ajax({
            type    :  "post",
            url     :  url + "/v1.0/static/token",
            headers : {'access_token': user_token},
            success :   function(json){
                $scope.uploadToken = json.token;
                $scope.uploadKey = json.key;
                $scope.uploadUtil(id);
            }
        })
    }
    
    function getCatalogList(){
        var promise = $http({
            method  : 'GET',
            url     : url + "/v1.0/catalogs",
            headers : { 'Content-Type': 'application/x-www-form-urlencoded',
                      'access_token': user_token}
        });
        promise.success(function(data,status,config,headers){
            $scope.catalogs = data.catalogs;
        });
        promise.error(function(data,status,hedaers,config){
            //处理失败后的响应
        });
    }
    getCatalogList();

    $scope.submitNewClassification = function(name, icon){
        $.ajax({
            method  : 'post',
            url     : url + '/v1.0/catalog',
            data  : JSON.stringify({
                "name": name,
                "icon": icon
            }),
            headers : {'access_token': user_token},
            success : function(data){
                alert("success");
                getCatalogList();
            },
            error : function(data){
                alert("error")   
            }
            
        })
    }
    $scope.updateClassification = function(type, id, name, icon){
        var data;
        if(type == 1){
            data = {"name": name};
        }
        else if(type == 2){
            data = {"icon": icon};
        }
        $.ajax({
            method  : 'put',
            url     : url + '/v1.0/catalog/' + id,
            data  : JSON.stringify(data),
            headers : {'access_token': user_token},
            success : function(data){
                alert("success");
                $("#uploadBt"+id).hide();
                $('#saveBt'+id).hide();
            },
            error : function(data){
                alert("error");   
            }
            
        });
    }


    $scope.addClasification = function(){
        var data = {id:-1, name: "新建分类", icon: "img/p0.jpg"};
        $scope.catalogs.push(data);
    }
    
    $scope.saveChange = function(id){
        if(id == -1){
            $scope.upload(id);
        }else{
            $scope.updateClassification(1, id, $(".name"+id).val(), "");
        }
    }
    $scope.deleChange = function(id){
        if(id == -1){
            $scope.catalogs.pop();
            return 0;
        }
        if(confirm("确定删除吗？")){
            $.ajax({
                method  : 'delete',
                url     : url + '/v1.0/catalog/' + id,
                headers : {'access_token': user_token},
                success : function(state){
                    getCatalogList();
                },
                error : function(data){
                    alert("error");   
                }
            });
        }
    }

    $scope.uploadUtil = function(id){
        var Qiniu_upload = function(id, f, token, key) {
            var xhr = new XMLHttpRequest();

            xhr.open('POST', "https://up.qbox.me", true);
            var formData;
            formData = new FormData();
            if (key !== null && key !== undefined) formData.append('key', key);
            formData.append('token', token);
            formData.append('file', f);

            xhr.onreadystatechange = function(response,data,info,jj) {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                    var blkRet = JSON.parse(xhr.responseText);
                    if(id == -1){
                        //新建分类
                        $scope.submitNewClassification($(".name"+id).val(), blkRet.key);
                    }else{
                        //更新分类
                        $scope.updateClassification(2, id, "", blkRet.key);
                    }
                } else if (xhr.status != 200 && xhr.responseText) {
                    //alert("网络错误");
                }
            };
            xhr.send(formData);
        };
        if ($("#fileInput"+id)[0].files.length > 0) {
            Qiniu_upload(id, $("#fileInput"+id)[0].files[0], $scope.uploadToken, $scope.uploadKey);
        } else {
            console && console.log("form input error");
        }
    }

    $scope.clickImg = function(id){
        $("#fileInput"+id).click();
        $("#fileInput"+id).on("change", function(){
            $("#img"+id)[0].src = getObjectURL($("#fileInput"+id)[0].files[0]);
            if(id == -1){
                $('#saveBt'+id).show();
            }else{
                $("#uploadBt"+id).show();
            }
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

