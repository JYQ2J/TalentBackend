var MOFUN = window.MOFUN || {};

MOFUN.share = function (shareText, apiKeys) {
	
};

MOFUN.upgradeBrowser = function (list, ulCss, liCss) {
	list = list || ["ie", "cr", "fx"];
	ulCss = ulCss || "";
	liCss = liCss || "";
	var browsers = {
		"ie": {
			name: "Internet Exlporer",
			link: "http://windows.microsoft.com/zh-CN/internet-explorer/download-ie"
		},
		"cr": {
			name: "Chrome 浏览器",
			link: "https://www.google.com/intl/zh-CN/chrome/"
		},
		"fx": {
			name: "火狐浏览器",
			link: "http://firefox.com.cn/"
		}
	};
	var div = document.createElement("ul");
	div.id = "upgradebrowser";
	div.style.cssText = ulCss;
	var temp = "";
	for (var i = 0, l = list.length; i < l; i++) {
		if (list[i] in browsers) {
			var browser = browsers[list[i]];
			temp += "<li style='" + liCss + "'><a href='" + browser.link + "'><img src='../_global/browser_logo/" + list[i] + ".png' alt='" + browser.name + "' /> <span>" + browser.name + "</span></a></li>";
		};
	};
	div.innerHTML = temp;
	return div;
};

MOFUN.random = function (max, min) {
	max = max || 100;
	min = min || 0;
	return Math.ceil(Math.random() * (max - min) + min);
};

MOFUN.remove = function (ele) {
	ele && ele.parentNode.removeChild(ele);
};

if("ontouchstart" in window) {
document.documentElement.className += "touch";
document.addEventListener("DOMContentLoaded", function(event) {
	document.querySelector(".app-all").onclick = function (){return false};
	document.querySelector(".app-all").ontouchend = function (){
		document.querySelector(".navbar-app").classList.toggle("over");
	};
});
}