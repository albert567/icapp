$(function() {
	$('.um-back').click(function() {
		summer.closeWin();
	});

	if (localStorage.getItem("orgs") != null) {
		var str = localStorage.getItem("orgs");
		var orgs = JSON.parse(str);
		for (var i = 0; i < orgs.length; i++) {
			var org = orgs[i];
			$("#sel_org").append("<option value='" + org.pk_org + "'>" + org.name + "</option>");
		}
	}
});

function save() {
	var sel_org = $summer.byId("sel_org");
	var org = sel_org.options[sel_org.selectedIndex];
	localStorage.setItem("pk_org", org.value);
	var server = localStorage.getItem("server");
	var usercode = localStorage.getItem("user");
	var pwd = localStorage.getItem("pwd");
	var ds = localStorage.getItem("ds");
	var url = "http://" + server + "/service/stordocLoadServlet";
	summer.showProgress({
		title : '加载中...'
	});
	summer.post(url, {
		"usercode" : usercode,
		"pwd" : pwd,
		"ds" : ds,
		"pk_org" : org.value
	}, {
	}, function(response) {
		summer.hideProgress();
		localStorage.setItem("stordocs", response.data);
		UM.modal("alert", {
			title : window.location.host || "",
			text : "保存成功！",
			overlay : true,
			ok : function(data) {
				summer.closeWin();
			},
			delay : 300, //Number
			callback : null
		});
	}, function(response) {
		summer.hideProgress();
		summer.toast({
			"msg" : "无法连接服务器，请检查网络"
		});
	});

}