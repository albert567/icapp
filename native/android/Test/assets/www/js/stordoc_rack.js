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
	var jsonArray = [{"code":"03040204","name":"03楼04区02架04盒"},
						{"code":"03040205","name":"03楼04区02架05盒"},
						{"code":"03040301","name":"03楼04区03架01盒"}];
	viewModel.data = ko.observableArray(jsonArray);
	ko.applyBindings(viewModel);
});

