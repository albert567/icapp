var viewModel;
var listview;
var body = [];

summerready = function() {
	$('.um-back').click(function() {
		clear();
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

	if (localStorage.getItem("stordoc") != null) {
		$summer.byId("sel_stordocs").value = localStorage.getItem("stordoc");
	}

	if (localStorage.getItem("body") != null) {
		body = JSON.parse(localStorage.getItem("body"));
	}

	//构造控件实例
	listview = UM.listview("#listview");
	//Knockout绑定
	var ViewModel = function() {
	};
	viewModel = new ViewModel();

	viewModel.data = ko.observableArray(body);
	ko.applyBindings(viewModel);
	listview.on("itemClick", function(sender, args) {
		//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		var data = viewModel.data()[args.rowIndex];
		var url = "http://" + localStorage.getItem("server") + "/service/queryBatchByMatServlet";
		summer.post(url, {
			"usercode" : localStorage.getItem("user"),
			"pwd" : localStorage.getItem("pwd"),
			"ds" : localStorage.getItem("ds"),
			"cmaterialid" : data.cmaterialid
		}, {
		}, function(response) {
			summer.hideProgress();
			var batches = response.data;
			summer.openWin({
				id : 'sDeliveryDetail',
				url : 'html/sDeliveryDetail.html',
				pageParam : {
					rowIndex : args.rowIndex,
					batches : batches
				}
			});
		}, function(response) {
			summer.hideProgress();
			summer.toast({
				"msg" : "无法连接服务器，请检查网络"
			});
		});
	});
}
//清理localStorage
function clear() {
	if (localStorage.getItem("cdeliveryid") != null) {
		localStorage.removeItem("cdeliveryid");
		localStorage.removeItem("body");
	}
}

/**
 * 扫描销售发货单
 */
function scanDeliver() {
	var sel_stordocs = $summer.byId("sel_stordocs");
	var stordoc = sel_stordocs.options[sel_stordocs.selectedIndex].value;
	localStorage.setItem("stordoc", stordoc);
	clear();
	summer.openScanner({
		callback : function(args) {
			var cdeliveryid = args.umdcode;
			var url = "http://" + localStorage.getItem("server") + "/service/queryDeliveryServlet";
			summer.showProgress({
				title : '加载中...'
			});
			summer.post(url, {
				"usercode" : localStorage.getItem("user"),
				"pwd" : localStorage.getItem("pwd"),
				"ds" : localStorage.getItem("ds"),
				"cdeliveryid" : cdeliveryid
			}, {
			}, function(response) {
				summer.hideProgress();
				var ret = JSON.parse(response.data);
				if (ret.isSucceed) {
					body = ret.data.body;
					localStorage.setItem("cdeliveryid", cdeliveryid);
					localStorage.setItem("body", JSON.stringify(ret.data.body));
					viewModel.data.removeAll();
					for (var i = 0; i < body.length; i++) {
						viewModel.data.push(body[i]);
					}
					listview.refresh();
				} else {
					summer.toast({
						"msg" : ret.msg
					});
				}
			}, function(response) {
				summer.hideProgress();
				summer.toast({
					"msg" : "无法连接服务器，请检查网络"
				});
			});
		}
	});
}

/**
 * 提交
 */
function save() {
	if (localStorage.getItem("body") == null) {
		summer.toast({
			"msg" : "请先扫描销售发货单"
		});
		return false;
	}
	body = JSON.parse(localStorage.getItem("body"));
	for (var i = 0; i < body.length; i++) {
		var obj = body[i];
		if (obj.rackcode == "") {
			summer.toast({
				"msg" : "行" + obj.crowno + "的货位为空"
			});
			return false;
		}
		if (obj.scannum == "" || obj.scannum == 0) {
			summer.toast({
				"msg" : "行" + obj.crowno + "扫描主数量必须大于0"
			});
			return false;
		}
	}
	var url = "http://" + localStorage.getItem("server") + "/service/pushSaleOutServlet";
	summer.showProgress({
		title : '加载中...'
	});
	summer.post(url, {
		"usercode" : localStorage.getItem("user"),
		"pwd" : localStorage.getItem("pwd"),
		"ds" : localStorage.getItem("ds"),
		"cdeliveryid" : localStorage.getItem("cdeliveryid"),
		"pk_stordoc" : localStorage.getItem("stordoc"),
		"body" : JSON.stringify(body)
	}, {
	}, function(response) {
		summer.hideProgress();
		var ret = JSON.parse(response.data);
		if (ret.isSucceed) {
			summer.toast({
				"msg" : "销售出库单生成成功"
			});
			localStorage.removeItem("body");
			viewModel.data.removeAll();
			listview.refresh();
		} else {
			summer.toast({
				"msg" : ret.msg
			});
		}
	}, function(response) {
		summer.hideProgress();
		summer.toast({
			"msg" : "无法连接服务器，请检查网络"
		});
	});

}