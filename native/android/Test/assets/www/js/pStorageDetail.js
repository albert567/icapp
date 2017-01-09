var index;
var cspecial;
var body;
var obj;
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
	index = summer.pageParam.index;
	cspecial = JSON.parse(localStorage.getItem("cspecial"));
	body = cspecial.body;
	obj = body[index];
	$summer.byId("txt_crowno").value = obj.crowno;
	$summer.byId("txt_materialcode").value = obj.materialCode;
	$summer.byId("txt_materialname").value = obj.materialName;
	$summer.byId("txt_materialspec").value = obj.materialspec;
	$summer.byId("txt_materialtype").value = obj.materialtype;
	$summer.byId("txt_outrack").value = obj.rackName;
	$summer.byId("txt_vbatchcode").value = obj.vbatchcode;
	$summer.byId("txt_nonhandnum").value = obj.nonhandnum;
	$summer.byId("txt_ncountnum").value = obj.ncountnum;
}
//保存
function save(){
	var ncountnum = $summer.byId("txt_ncountnum").value;
	if(ncountnum==""||ncountnum<0){
		summer.toast({
			"msg" : "盘点主数量必须大于等于0"
		});
		return false;
	}
	
	obj.ncountnum = ncountnum;
	obj.ncountastnum = ncountnum;
	body[index] = obj;
	cspecial.body = body;
	localStorage.setItem("cspecial",JSON.stringify(cspecial));
	summer.openWin({
		id : 'pStorageBody',
		url : 'html/pStorageBody.html'
	});
}
