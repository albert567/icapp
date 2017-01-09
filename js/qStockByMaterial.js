$(function() {
	$('.um-back').click(function() {
		summer.closeWin();
	});
	$(".um-header-right").popover({
		content : document.getElementById("temp").innerHTML,
		width : 140,
		animation : "pop",
		delay : {
			show : 100,
			hide : 100
		}
	});
	var stordocs = JSON.parse(localStorage.getItem("stordocs"));
	for (var i = 0; i < stordocs.length; i++) {
		var stordoc = stordocs[i];
		$("#sel_stordocs").append("<option value='" + stordoc.pk_stordoc + "'>" + stordoc.name + "</option>");
	}

	var data = [];
	$('#dg').datagrid({
		data : data
	});
});
/**
 *  按仓库和货位查询
 */
function search() {
	var sel_stordocs = $summer.byId("sel_stordocs");
	var stordoc = sel_stordocs.options[sel_stordocs.selectedIndex].value;
	var materialcode = $summer.byId("txt_material").value;
	if ("" == materialcode) {
		summer.toast({
			"msg" : "请先输入存货编码"
		});
		return false;
	}
	var server = localStorage.getItem("server");
	var usercode = localStorage.getItem("user");
	var pwd = localStorage.getItem("pwd");
	var ds = localStorage.getItem("ds");
	var pkorg = localStorage.getItem("pk_org");
	var url = "http://" + server + "/service/queryStockByMaterialServlet";
	summer.showProgress({
		title : '加载中...'
	});
	summer.post(url, {
		"usercode" : usercode,
		"pwd" : pwd,
		"ds" : ds,
		"pk_org" : pkorg,
		"pk_stordoc" : stordoc,
		"materialcode" : materialcode
	}, {
	}, function(response) {
		summer.hideProgress();
		var data = JSON.parse(response.data);
		if (data.length == 0) {
			summer.toast({
				"msg" : "没有找到记录!"
			});
		} else {
			$('#dg').datagrid({
				data : data
			});
		}
	}, function(response) {
		summer.hideProgress();
		summer.toast({
			"msg" : "无法连接服务器，请检查网络"
		});
	});
}
