var viewModel;
var listview;
$(function() {
	$('.um-back').click(function() {
		summer.closeWin();
	});
	//构造控件实例
	listview = UM.listview("#listview");
	//Knockout绑定
	var ViewModel = function() {
	};
	viewModel = new ViewModel();
	var jsonArray = [{
		"code" : "DTW",
		"name" : "直运库",
		"address" : "123"
	}, {
		"code" : "Z300",
		"name" : "直运库",
		"address" : "123"
	}, {
		"code" : "Z301",
		"name" : "直运库",
		"address" : "123"
	}];
	viewModel.data = ko.observableArray(jsonArray);
	ko.applyBindings(viewModel);

	listview.on("itemClick", function(sender, args) {
		//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		var data = viewModel.data()[args.rowIndex];
		var storCode = data.code;
		//
		summer.openWin({
			id : 'stordoc_rack',
			url : 'html/stordoc_rack.html'
		});
	});
});

function download(){

}

