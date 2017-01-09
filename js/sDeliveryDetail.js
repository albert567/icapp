var viewModel;
var listview;
var body = [];
var obj;
var rowIndex;
summerready = function() {
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
	init();
}
/**
 * 初始化
 */
function init() {
	body = JSON.parse(localStorage.getItem("body"));
	rowIndex = summer.pageParam.rowIndex;
	obj = body[rowIndex];
	//单据号
	$summer.byId("txt_vbillcode").value = obj.vbillcode;
	//行号
	$summer.byId("txt_linenum").value = obj.crowno;
	//物料编码
	$summer.byId("txt_materialcode").value = obj.materialCode;
	//物料名称
	$summer.byId("txt_materialname").value = obj.materialName;
	//客户
	$summer.byId("txt_customer").value = obj.cordercustName;
	//转出货位
	$summer.byId("txt_outrack").value = obj.rackcode;
	//批次号
	//应发主数量
	$summer.byId("txt_shouldnum").value = obj.nnum;
	//扫描主数量
	$summer.byId("txt_scannum").value = obj.scannum;
	//批次号
	var batches = JSON.parse(summer.pageParam.batches);
	$("#sel_batchcodes").append("<option value=''></option>");
	for (var i = 0; i < batches.length; i++) {
		var batch = batches[i];
		$("#sel_batchcodes").append("<option value='" + batch.pk_batchcode + "'>" + batch.vbatchcode + "</option>");
	}
	$summer.byId("sel_batchcodes").value = obj.pk_batchcode;
}

//扫描物料码
function scanMaterial() {
	summer.openScanner({
		callback : function(args) {
			var cmaterialid = args.umdcode;
			if (cmaterialid != obj.cmaterialid) {
				summer.toast({
					"msg" : "物料码不符合"
				});
			}
		}
	});
}

/**
 * 保存
 */
function save() {
	//转出货位
	var outrack = $summer.byId("txt_outrack").value;
	if (outrack == "") {
		summer.toast({
			"msg" : "货位不能为空"
		});
		return false;
	}
	//批次号
	var sel_batchcodes = $summer.byId("sel_batchcodes");
	var pk_batchcode = sel_batchcodes.options[sel_batchcodes.selectedIndex].value;
	//扫描主数量
	var scannum = $summer.byId("txt_scannum").value;
	var shouldnum = $summer.byId("txt_shouldnum").value;
	if (scannum == "" || scannum == 0) {
		summer.toast({
			"msg" : "请输入扫描主数量"
		});
		return false;
	} else {
		if (scannum > shouldnum) {
			summer.toast({
				"msg" : "扫描主数量不能大于应发主数量"
			});
			return false;
		}
	}
	body[rowIndex].rackcode = outrack;
	body[rowIndex].pk_batchcode = pk_batchcode;
	body[rowIndex].scannum = scannum;
	localStorage.setItem("body", JSON.stringify(body));
	summer.openWin({
		id : 'sDelivery',
		url : 'html/sDelivery.html'
	});
}
