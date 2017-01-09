var viewModel;
var listview;
var cspecial;
var body;

summerready = function() {
	$('.um-back').click(function() {
		summer.closeToWin({"id":"pStorage"});
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
	cspecial = JSON.parse(localStorage.getItem("cspecial"));
	body = cspecial.body;

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
		summer.openWin({
			id : 'pStorageDetail',
			url : 'html/pStorageDetail.html',
			pageParam : {
				index : args.rowIndex
			}
		});
	});
}

/**
 * 扫描物料码
 */
function scanMaterial() {
	summer.openScanner({
		callback : function(args) {
			var cmaterialoid = args.umdcode;
			var rackCode = $summer.byId("txt_rack").value;
			var str = cmaterialoid + rackCode;
			for (var i = 0; i < body.length; i++) {
				var obj = body[i];
				if ("" == rackCode) {
					if (obj.cmaterialoid == cmaterialoid) {
						break;
					}
				} else {
					if (obj.rackCode == rackCode && obj.cmaterialoid == cmaterialoid) {
						break;
					}
				}
			}
			if (i < body.length) {//找到index
				summer.openWin({
					id : 'pStorageDetail',
					url : 'html/pStorageDetail.html',
					pageParam : {
						index : i
					}
				});
			} else {//没有找到
				summer.toast({
					"msg" : "货位或物料码有误"
				});
			}
		}
	});
}
