var viewModel;
var listview;

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

	//构造控件实例
	listview = UM.listview("#listview");
	//Knockout绑定
	var ViewModel = function() {
	};
	viewModel = new ViewModel();

	viewModel.data = ko.observableArray([]);
	ko.applyBindings(viewModel);
	listview.on("itemClick", function(sender, args) {
		//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		summer.openWin({
			id : 'pStorageBody',
			url : 'html/pStorageBody.html'
		});
	});
}
//清理localStorage
function clear() {
	if (localStorage.getItem("cspecial") != null) {
		localStorage.removeItem("cspecial");
	}
}

/**
 * 扫描库存盘点单
 */
function scanInvCountH() {
	clear();
	summer.openScanner({
		callback : function(args) {
			var cspecialhid = args.umdcode;
			var url = "http://" + localStorage.getItem("server") + "/service/queryInvCountByPKServlet";
			summer.showProgress({
				title : '加载中...'
			});
			summer.post(url, {
				"usercode" : localStorage.getItem("user"),
				"pwd" : localStorage.getItem("pwd"),
				"ds" : localStorage.getItem("ds"),
				"cspecialhid" : cspecialhid
			}, {
			}, function(response) {
				summer.hideProgress();
				var ret = JSON.parse(response.data);
				if (ret.isSucceed) {
					localStorage.setItem("cspecial", response.data);
					var obj = {
						"vbillcode" : ret.vbillcode,
						"dcountdate" : ret.dcountdate,
						"storName" : ret.storName,
						"transtypeName" : ret.transtypeName
					};
					viewModel.data.removeAll();
					viewModel.data.push(obj);
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
function upload() {
	if (localStorage.getItem("cspecial") == null) {
		summer.toast({
			"msg" : "请先扫描库存盘点单"
		});
		return false;
	}
	var cspecial = JSON.parse(localStorage.getItem("cspecial"));
	var body = cspecial.body;
	var array = [];
	for (var i = 0; i < body.length; i++) {
		array.push(body[i].ncountnum);
	}

	var url = "http://" + localStorage.getItem("server") + "/service/updateInvCountByPKServlet";
	summer.post(url, {
		"usercode" : localStorage.getItem("user"),
		"pwd" : localStorage.getItem("pwd"),
		"ds" : localStorage.getItem("ds"),
		"cspecialhid" : cspecial.cspecialhid,
		"array" : array.toString()
	}, {
	}, function(response) {
		summer.hideProgress();
		var ret = JSON.parse(response.data);
		if (ret.isSucceed) {
			summer.toast({
				"msg" : "执行成功"
			});
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