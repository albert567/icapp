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
});

/**
 * 库存查询
 */
function qStock() {
	if (localStorage.getItem("pk_org") == null) {
		summer.toast({
			"msg" : "请先进行业务设置"
		});
		return false;
	}
	summer.openWin({
		id : 'qStock',
		url : 'html/qStock.html'
	});
}

/**
 * 库存盘点
 */
function pStorage() {
	if (localStorage.getItem("pk_org") == null) {
		summer.toast({
			"msg" : "请先进行业务设置"
		});
		return false;
	}
	//clear
	if (localStorage.getItem("cspecial") != null) {
		localStorage.removeItem("cspecial");
	}
	summer.openWin({
		id : 'pStorage',
		url : 'html/pStorage.html'
	});
}

/**
 * 销售出库
 */
function sDelivery() {
	if (localStorage.getItem("pk_org") == null) {
		summer.toast({
			"msg" : "请先进行业务设置"
		});
		return false;
	}
	//clear
	if (localStorage.getItem("cdeliveryid") != null) {
		localStorage.removeItem("cdeliveryid");
		localStorage.removeItem("body");
	}
	summer.openWin({
		id : 'sDelivery',
		url : 'html/sDelivery.html'
	});
}

/**
 * 货位转移
 */
function tStock() {
	if (localStorage.getItem("pk_org") == null) {
		summer.toast({
			"msg" : "请先进行业务设置"
		});
		return false;
	}
	summer.openWin({
		id : 'tStock',
		url : 'html/tStock.html'
	});
}