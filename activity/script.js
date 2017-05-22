$(function () {
    function checkLocalStorage() {
            if (window.localStorage) {
                return true;
            } else {
                return false;
            }
        }

        /* 设置 localStorage */
        function setLocalStorage(key, val) {
            window.localStorage.setItem(key, val);
        }

        /* 获取 localStorage */
        function getLocalStorage(key) {
            return window.localStorage.getItem(key);
        }

        /* 移除 localStorage */
        function rmLocalStorage(key) {
            return window.localStorage.removeItem(key);
        }

        /* 显示 localStorage */
        function showLocalStorage() {
            var storage = window.localStorage;
            for (var i = 0; i < storage.length; i++) {
                //key(i)获得相应的键，再用getItem()方法获得对应的值
                document.write(storage.key(i) + " : " + storage.getItem(storage.key(i)) + "<br>");
            }
        }
//    function t(t, e) {
//        l || (b = t, titleDom.css("position", "relative").stop().animate({
//            left: "-20px"
//        }, 50).animate({
//            left: "20px"
//        }, 50).animate({
//            left: "-10px"
//        }, 50, function () {
//            timeDom.text(foodList[b][0]), whatDom.text("神马"), punctuationDom.text("？"), listDom.val(foodList[b][1])
//        }).animate({
//            left: "10px"
//        }, 50).animate({
//            left: "-5px"
//        }, 50).animate({
//            left: "5px"
//        }, 50).animate({
//            left: 0
//        }, 50, function () {
//            $(this).removeAttr("style")
//        }), e && $("<i class='notdinner'></i>").css({
//            top: "-50px",
//            opacity: 0
//        }).appendTo(wrapperDom).animate({
//            top: "+=10px",
//            opacity: 1
//        }, 300).delay(3e3).fadeOut(700, function () {
//            $(this).remove()
//        }))
//    }
    var timer, maxWindowHeight, maxWindowWidth, isStop = 0,
        titleDom = $(".title"),
        timeDom = $(".time"),
        whatDom = $(".what"),
        punctuationDom = $(".punctuation"),
        startDom = $("#start"),
        menuDom = $("#menu"),
        dpDom = $("#dp"),
        listDom = $("#list"),
        foodList = [["早饭", "面包 蛋糕 荷包蛋 烧饼 饽饽 肉夹馍 油条 馄饨 火腿 面条 小笼包 玉米粥 肉包 煎饼果子 饺子 煎蛋 烧卖 生煎 锅贴 包子 酸奶 苹果 梨 香蕉 皮蛋瘦肉粥 蛋挞 南瓜粥 煎饼 玉米糊 泡面 粥 馒头 燕麦片 水煮蛋 米粉 豆浆 牛奶 花卷 豆腐脑 煎饼果子 小米粥 黑米糕 鸡蛋饼 牛奶布丁 水果沙拉 鸡蛋羹 南瓜馅饼 鸡蛋灌饼 奶香小馒头 汉堡包 披萨 八宝粥 三明治 蛋包饭 豆沙红薯饼 驴肉火烧 粥 粢饭糕 蒸饺 白粥"],
        				["午饭", ""],
        			 ["晚饭", "盖浇饭 砂锅 大排档 米线 满汉全席 西餐 麻辣烫 自助餐 炒面 快餐 水果 西北风 馄饨 火锅 烧烤 泡面 水饺 日本料理 涮羊肉 味千拉面 面包 扬州炒饭 自助餐 菜饭骨头汤 茶餐厅 海底捞 西贝莜面村 披萨 麦当劳 KFC 汉堡王 卡乐星 兰州拉面 沙县小吃 烤鱼 烤肉 海鲜 铁板烧 韩国料理 粥 快餐 萨莉亚 桂林米粉 东南亚菜 甜点 农家菜 川菜 粤菜 湘菜 本帮菜 生活 全家便当"]],
        b = 2,
        _ = [],
        x = [],
        isDzdping = 0,
        I = (new Date).getHours(),
        windowDom = $(window),
        bodyDom = $("body"),
        wrapperDom = $("#wrapper"),
        bodyStyle = document.body.style,
        isSupportAnimation = "animation" in bodyStyle || "webkitAnimation" in bodyStyle || "MozAnimation" in bodyStyle,
        list = JSON.parse(getLocalStorage("userList"))
    startDom.click(function () {
        if (isStop) {
            debugger
        	isStop = 0, 
	        punctuationDom.text("！"), 
	        startDom.attr("data-status", "again"), clearInterval(timer),
            list.splice(parseInt($("[data-index]").attr('data-index')),1)
//            rmLocalStorage(),
        }
            
        else {
            isStop = 1
//            var t = isDzdping ? x : listDom.val().replace(/ +/g, " ").replace(/^ | $/g, "").split(" ")
            punctuationDom.text("？"), 
            startDom.attr("data-status", "stop"), 
            timer = setInterval(function () {
                var e = MOFUN.random(list.length) - 1,
                    a = list[e],
                    topPosition = MOFUN.random(maxWindowHeight),
                    leftPosition = MOFUN.random(maxWindowWidth - 50),
                    fontSizeRandom = MOFUN.random(37, 14),
                    AphoneNum = a.phone.substring(0,3)+"****"+a.phone.substring(7,11);
//                isDzdping ? whatDom.html("<a href='" + _[e].business_url + "' data-id='" + e + "' target='_blank' title='前往大众点评查看商户详情'>" + a + "</a>") : whatDom.text(a)
                
                whatDom.html("<span data-index='"+e+"'><img width=40px src='"+a.image +"' onerror='defaultImg(this)'><span class='flashNickName'>" + a.nickname + "</span><span class='flashTelNum'>"+AphoneNum+"</span></span>") 
                var l = $("<span class='temp'>" + a.nickname + "</span>").css({
                    top: topPosition,
                    left: leftPosition,
                    color: "rgba(213,121,106," + MOFUN.random(7, 3) / 10 + ")",
                    fontSize: fontSizeRandom + "px"
                }).appendTo(bodyDom)
                isSupportAnimation ? l.one("animationend webkitAnimationEnd", function () {
                    l.remove()
                }) : l.hide().fadeIn("slow", function () {
                    $(this).fadeOut("slow", function () {
                        $(this).remove()
                    })
                })
            }, 60)
        }
    }),
    
//    listDom.val(foodList[2][1]),
//        listDom.val
    
     windowDom.resize(function () {
         maxWindowWidth = windowDom.width(), maxWindowHeight = windowDom.height()
     }).resize()
    
    

})