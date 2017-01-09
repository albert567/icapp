function alertInfo(str){
	UM.modal("alert", {
			title : window.location.host || "",
			text : str,
			overlay : true,
			ok : function(data) {
			},
			delay : 300, //Number
			callback : null
		});
}

/**
 * 主界面
 */
function mainPage() {
	summer.openWin({
		id : 'menu',
		url : 'html/menu.html'
	});
}

/**
 * 业务设置
 */
function menu_b() {
	var server = localStorage.getItem("server");
	var usercode = localStorage.getItem("user");
	var pwd = localStorage.getItem("pwd");
	var ds = localStorage.getItem("ds");
	var pk_group = localStorage.getItem("pk_group");
	var url = "http://" + server + "/service/orgLoadServlet";
	summer.showProgress({
		title : '加载中...'
	});
	summer.post(url, {
		"usercode" : usercode,
		"pwd" : pwd,
		"ds" : ds,
		"pk_group" : pk_group
	}, {
	}, function(response) {
		summer.hideProgress();
		localStorage.setItem("orgs", response.data);
		summer.openWin({
			id : 'menu_b',
			url : 'html/menu_b.html'
		});
	}, function(response) {
		summer.hideProgress();
		alertInfo("无法连接服务器，请检查网络！");
	});

}

/**
 * 注销
 */
function logOut() {
	summer.openWin({
		id : 'index',
		url : 'index.html'
	});
}