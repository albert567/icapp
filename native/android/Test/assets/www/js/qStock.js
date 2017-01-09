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
 *  按仓库和货位查询
 */
function qStockByRack() {
	summer.openWin({
		id : 'qStockByRack',
		url : 'html/qStockByRack.html'
	});
}

/**
 * 按仓库和存货编码查询
 */
function qStockByMaterial() {
	summer.openWin({
		id : 'qStockByMaterial',
		url : 'html/qStockByMaterial.html'
	});
}