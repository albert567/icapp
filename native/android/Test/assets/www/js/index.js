summerready = function() {
	//监听返回键
	document.addEventListener("backbutton", onBackKeyDown, false);
	/*localStorage.setItem("user", "zhangyph");
	 localStorage.setItem("pwd", "nc1234");
	 localStorage.setItem("ds", "design");
	 localStorage.setItem("pk_group", "0001SO100000000005EO");*/

	$(".um-input-clear.ti-close").click(function() {
		$(this).prev("input").val("");
	})
	$(".um-input-clear.ti-eye").click(function() {
		var $pre_input = $(this).prev("input");
		('password' == $pre_input.attr('type')) ? $pre_input.attr('type', 'text') : $pre_input.attr('type', 'password');
		$(this).toggleClass('eye');
	})
	if (localStorage.getItem("server") == null) {
		$summer.byId("server").value = "192.168.155.1:8111";
		localStorage.setItem("server", $summer.byId("server").value);
	} else {
		$summer.byId("server").value = localStorage.getItem("server");
	}
	if (localStorage.getItem("ds") == null) {
		$summer.byId("dbsrc").value = "design";
		localStorage.setItem("ds", $summer.byId("dbsrc").value);
	} else {
		$summer.byId("dbsrc").value = localStorage.getItem("ds");
	}
	if (localStorage.getItem("user") != null) {
		$summer.byId("user").value = localStorage.getItem("user");
	}
	if (localStorage.getItem("pwd") != null) {
		$summer.byId("pwd").value = localStorage.getItem("pwd");
	}
}
var turn = 0;
function onBackKeyDown() {
	turn++;
	if (turn == 2) {
		clearInterval(intervalID);
		summer.exitApp()
	} else {
		summer.toast({
			"msg" : "再点击一次退出!"
		});
	}
	var intervalID = setInterval(function() {
		clearInterval(intervalID);
		turn = 0;
	}, 3000);
};

function login() {
	var user = $summer.byId("user").value;
	var pwd = $summer.byId("pwd").value;
	var server = localStorage.getItem("server");
	if (user == "") {
		summer.toast({
			"msg" : "用户名不能为空"
		});
		return false;
	}
	if (pwd == "") {
		summer.toast({
			"msg" : "密码不能为空"
		});
		return false;
	}
	
	//获取用户信息
	var userUrl = "http://" + server + "/service/loginServlet";
	summer.showProgress({
		title : '加载中...'
	});
	summer.post(userUrl, {
		"usercode" : user,
		"pwd" : pwd,
		"ds" : localStorage.getItem("ds")
	}, {
	}, function(response) {
		summer.hideProgress();
		var ret = JSON.parse(response.data);
		if (ret.islogin) {
			localStorage.setItem("user", user);
			localStorage.setItem("pwd", pwd);
			localStorage.setItem("pk_group", ret.pk_group);
			localStorage.setItem("cuserid", ret.cuserid);
			summer.openWin({
				id : 'menu',
				url : 'html/menu.html'
			});
		} else {
			summer.toast({
				"msg" : "用户名或密码错误"
			});
		}

	}, function(response) {
		summer.hideProgress();
		summer.toast({
			"msg" : "无法连接服务器，请检查网络"
		});
	});
}

function setting() {
	var settings = {
		target : "#setting",
		isReverse : 0,
		transition : "um"
	};
	UM.page.changePage(settings);
}

function back() {
	UM.page.back();
}

function save() {
	var server = $summer.byId("server").value;
	var dbsrc = $summer.byId("dbsrc").value;
	if ("" == server) {
		summer.toast({
			"msg" : "服务器地址不能为空"
		});
		return false;
	}
	if ("" == dbsrc) {
		summer.toast({
			"msg" : "数据源不能为空"
		});
		return false;
	}
	localStorage.setItem("server", server);
	localStorage.setItem("ds", dbsrc);
	UM.modal("alert", {
		title : window.location.host || "",
		text : "保存成功！",
		overlay : true,
		ok : function(data) {
			back();
		},
		delay : 300, //Number
		callback : null
	});
}