var pk_material;
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
		$("#sel_outstordocs").append("<option value='" + stordoc.pk_stordoc + "'>" + stordoc.name + "</option>");
		$("#sel_instordocs").append("<option value='" + stordoc.pk_stordoc + "'>" + stordoc.name + "</option>");
	}
});
/**
 * 初始化数据
 */
function init() {
	$summer.byId("txt_matcode").value = "";
	//物料编码
	$summer.byId("txt_matname").value = "";
	//物料名称
	$summer.byId("txt_matspec").value = "";
	//物料规格
	$summer.byId("txt_mattype").value = "";
	//物料型号
	$summer.byId("txt_measdoc").value = "";
	//计量单位
	//批次号
	$("#sel_batchcodes").empty();
}

/**
 * 扫描物料条码
 */
function scanMaterial() {
	summer.openScanner({
		callback : function(args) {
			pk_material = args.umdcode;
			var url = "http://" + localStorage.getItem("server") + "/service/queryMaterialByPKServlet";
			summer.showProgress({
				title : '加载中...'
			});
			summer.post(url, {
				"usercode" : localStorage.getItem("user"),
				"pwd" : localStorage.getItem("pwd"),
				"ds" : localStorage.getItem("ds"),
				"cmaterialvid" : pk_material
			}, {
			}, function(response) {
				summer.hideProgress();
				var ret = JSON.parse(response.data);
				if ("" == ret.matcode) {
					summer.toast({
						"msg" : "二维码有误，请重新扫描"
					});
				} else {
					init();
					$summer.byId("txt_matcode").value = ret.matcode;
					//物料编码
					$summer.byId("txt_matname").value = ret.matname;
					//物料名称
					$summer.byId("txt_matspec").value = ret.matspec;
					//物料规格
					$summer.byId("txt_mattype").value = ret.mattype;
					//物料型号
					$summer.byId("txt_measdoc").value = ret.measdoc;
					//计量单位
					//批次号
					var batchcodes = ret.batchcodes;
					$("#sel_batchcodes").append("<option value=''></option>");
					for (var i = 0; i < batchcodes.length; i++) {
						var batchcode = batchcodes[i];
						$("#sel_batchcodes").append("<option value='" + batchcode.pk_batchcode + "'>" + batchcode.vbatchcode + "</option>");
					}
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
	if (!pk_material) {
		summer.toast({
			"msg" : "请先扫描物料码"
		});
		return false;
	}
	//转出仓库
	var sel_outstordocs = $summer.byId("sel_outstordocs");
	var pk_outstordoc = sel_outstordocs.options[sel_outstordocs.selectedIndex].value;
	//转出货位
	var outrackcode = $summer.byId("txt_outrack").value;
	if (outrackcode == "") {
		summer.toast({
			"msg" : "请输入转出货位"
		});
		return false;
	}
	//转入仓库
	var sel_instordocs = $summer.byId("sel_instordocs");
	var pk_instordoc = sel_instordocs.options[sel_instordocs.selectedIndex].value;
	
	//转入货位
	var inrackcode = $summer.byId("txt_inrack").value;
	if (inrackcode == "") {
		summer.toast({
			"msg" : "请输入转入货位"
		});
		return false;
	}
	if(pk_instordoc == pk_outstordoc && outrackcode == inrackcode){
		summer.toast({
			"msg" : "转出货位和转入货位不能相同"
		});
	}
	
	//转移数量
	var count = $summer.byId("count").value;
	if (count == "" || count <= 0) {
		summer.toast({
			"msg" : "转移数量必须大于0"
		});
	}
	//批次号
	var sel_batchcodes = $summer.byId("sel_batchcodes");
	var pk_batchcode = sel_batchcodes.options[sel_batchcodes.selectedIndex].value;

	var url = "http://" + localStorage.getItem("server") + "/service/transStockServlet";
	summer.showProgress({
		title : '加载中...'
	});
	summer.post(url, {
		"usercode" : localStorage.getItem("user"),
		"pwd" : localStorage.getItem("pwd"),
		"ds" : localStorage.getItem("ds"),
		"pk_org" : localStorage.getItem("pk_org"),
		"pk_material" : pk_material,
		"pk_outstordoc" : pk_outstordoc,
		"outrackcode" : outrackcode,
		"pk_instordoc" : pk_instordoc,
		"inrackcode" : inrackcode,
		"count" : count,
		"pk_batchcode" : pk_batchcode
	}, {
	}, function(response) {
		summer.hideProgress();
		var ret = JSON.parse(response.data);
		if (ret.isSucceed) {
			summer.toast({
				"msg" : "转移成功"
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