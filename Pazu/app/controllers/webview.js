var args = arguments[0] || {};

//$.toolbarB.visible = args.toolbarVisible;
$.webView.title = args.title;
$.webView.url = args.url;

var _title;

//-----------------------
// ブックマーク登録画面を開く
//-----------------------
function openWindow(e){
	var controller = Alloy.createController('add',{
		url:$.webView.url,
		value:$.webView.title
	});
	var win = controller.getView();
	
	Alloy.Globals.ActiveNav.openWindow(win, {animated : true});
}