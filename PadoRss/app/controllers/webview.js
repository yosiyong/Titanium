var args = arguments[0] || {};

//$.toolbarB.visible = args.toolbarVisible;
$.webView.title = args.title;
$.webView.url = args.url;
$.btnBookMark.visible = args.toolbarVisible;

var _title;

Ti.API.info("--webview.js--url" + args.url);

//-----------------------
// ブックマーク登録画面を開く
//-----------------------
function openWindow(e){
	var controller = Alloy.createController('add',{
		url:$.webView.url,
		value:$.webView.title
	});
	var win = controller.getView();
	win.open();
	//Alloy.Globals.ActiveNav.openWindow(win, {animated : true});
}

//---------------------------
// 閉じる
//---------------------------
function btnClose_click(e) {
	
	$.winWebView.close();
	
}
