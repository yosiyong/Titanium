// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
if (OS_IOS || OS_ANDROID) {
	Alloy.Globals.top = 0;
	Alloy.Globals.tableTop = '45dp';

	try {
		// check for iOS7
		if (OS_IOS && parseInt(Titanium.Platform.version.split(".")[0], 10) >= 7) {
			Ti.API.info("iOS7:"  + Titanium.Platform.version);
			Alloy.Globals.top = '20dp';
			Alloy.Globals.tableTop = '65dp';
		}
	} catch(e) {
		// catch and ignore
	}
}

if (Titanium.Network.online ===false){
	var dialog = Ti.UI.createAlertDialog({
		title:"ネットワーク接続できていません"
	});
	dialog.show();
}

Alloy.Globals.EnableRss = true;
Alloy.Globals.Rss = { "rss1": {"title":"パズドラ","site":"pad-plus.com"}
						,"rss2": {"title":"ガンパズ","site":"gunpaz.pad-plus.com"}
						,"rss3": {"title":"ディバゲ","site":"dg.pad-plus.com"}
						,"rss4": {"title":"クラクラ","site":"coc.pad-plus.com"}
						,"rss5": {"title":"ワンフリ","site":"wf.pad-plus.com"}
						};
					
Alloy.Globals.CurrentRss = { "title":"パズドラ","site":"pad-plus.com","url":"http://pad-plus.com/feed"};
