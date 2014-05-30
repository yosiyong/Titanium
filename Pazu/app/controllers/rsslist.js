var platFormWidth = Ti.Platform.displayCaps.platformWidth;
var unitWidth = platFormWidth / 5;
$.btnTab1.left = "0dp";
$.btnTab2.left = unitWidth + "dp";
$.btnTab3.left = (unitWidth * 2) +"dp";
$.btnTab4.left = (unitWidth * 3) + "dp";
$.btnMenu.left = (unitWidth * 4) + "dp";
$.btnTab4.backgroundImage = "/bn_rss_on.png";

var isIOS7 = isiOS7Plus();
var isIpad = OS_IOS && Alloy.isTablet;
var osname = Ti.Platform.osname;
var isIos = (osname === 'iphone' || osname === 'ipad');
var isAndroid = (osname === 'android');

function isiOS7Plus()
{
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);
		
		// can only test this support on a 3.2+ device
		if (major >= 7)
		{
			return true;
		}
	}
	return false;

}

//---------------------------
// 広告
//---------------------------
var ad = require('net.nend');
var adView;
if (isAndroid) {
    adView = ad.createView({
        spotId: 118486,
        apiKey: "190809b6d2c6a1f08ef90c2bf293ec978f1cc220",
        width: 320,
        height: 50,
        bottom: 50
    });
}else{
    adView = ad.createView({
        spotId: 118486,
        apiKey: "190809b6d2c6a1f08ef90c2bf293ec978f1cc220",
        width: 320,
        height: 50,
        bottom: 50
    });
}

// 受信成功通知
adView.addEventListener('receive',function(e){
    Ti.API.info('net.nend　receive');
});
// 受信エラー通知
adView.addEventListener('error',function(e){
    Ti.API.info('net.nend　error');
});
// クリック通知
adView.addEventListener('click',function(e){
    Ti.API.info('net.nend　click');
});

$.winRssList.add(adView);

//---------------------------
// 処理中Indicator
//---------------------------
var ActivityIndicatorStyle;
if (isIos) {
	ActivityIndicatorStyle = Titanium.UI.iPhone.ActivityIndicatorStyle;
} else if (sdkVersion >= 3.0){
	ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;
}
var baseActInd = Titanium.UI.createActivityIndicator({
	width : Ti.UI.SIZE,
	height : Ti.UI.SIZE
});

if (ActivityIndicatorStyle) {
	if (isIOS7) {
		baseActInd.style = ActivityIndicatorStyle.DARK;
	} else {
		baseActInd.style = ActivityIndicatorStyle.PLAIN;
	}
}
$.winRssList.add(baseActInd);

//---------------------------
//　メニューコントロールセット
//---------------------------
SetMenu();

//---------------------------
// RSS
//---------------------------
var rss = require('rss');
var _rssList = [];

var lastDistance = 0; // calculate location to determine direction
var lastRow = 20;
	
//var navActInd = Titanium.UI.createActivityIndicator();
//$.winRssList.setRightNavButton(navActInd);

var updating = false;
var loadingRow = Ti.UI.createTableViewRow();
var rowActInd = Ti.UI.createActivityIndicator({
	    left: 100,
	    height: 50,
	    width: 10
});

/*
CallEndRssList = function(e){
	Ti.API.info("★EndRssList:" + e.param1[0]);
	_rssList = [];
	_rssList = e.param1;
	GetLinkList(_rssList[0],0);
};
*/

CallEndLinks = function(e){
	Ti.API.info("★EndLinks:[" + e.param1 + "](" + e.param2 +")");
	
			//読み込み終了
			Ti.API.info("CallEndLinks:画面表示処理");
			
			//イベントリスーナー削除
			//Titanium.App.removeEventListener("EndRssList",CallEndRssList);
			Titanium.App.removeEventListener("EndLinks",CallEndLinks);
			
			//画面表示
			SetRssList();
			Alloy.Globals.EnableRss = false;
			$.btnRefresh.enabled = true;
			baseActInd.hide();
	
};


//---------------------------
//　ページロード
//---------------------------
RssListLoad();

function RssListLoad(){
	
	if (Alloy.Globals.EnableRss === true){
		lastDistance = 0; // calculate location to determine direction
		lastRow = 20;
		updating = false;
		
		baseActInd.show();
		Refresh();
	}

}


function beginUpdate()
{
	updating = true;
	baseActInd.show();

	if (ActivityIndicatorStyle) {
		if (isIOS7) {
			rowActInd.style = ActivityIndicatorStyle.DARK;
		} else {
			rowActInd.style = ActivityIndicatorStyle.PLAIN;
		}
	}
	rowActInd.message = 'Loading...';
	loadingRow.add(rowActInd);	
	rowActInd.show();
	
	$.tvRssList.appendRow(loadingRow);
	Ti.API.info("ADD LOAD ROW:" + lastRow);

	// just mock out the reload
	setTimeout(endUpdate,2000);
}
	
function endUpdate()
{
	updating = false;

	$.tvRssList.deleteRow(lastRow);
	Ti.API.info("DELETE ROW:" + lastRow);
	
	var db = Ti.Database.open('tRss');
	//alert(db.file.getNativePath());
	db.execute('CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)');
	
	//lastRow + 1行目から２０件取得	
	var resultSet = db.execute('SELECT id,title,url,pubDate FROM tRss ORDER BY pubDate DESC LIMIT 20 OFFSET ?', lastRow);
	
	while (resultSet.isValidRow()){
		
		//alert(resultSet.fieldByName('url'));
		$.tvRssList.appendRow(Alloy.createController('row', {
				articleUrl: resultSet.fieldByName('url'),
				title: resultSet.fieldByName('title'),
				date:resultSet.fieldByName('pubDate')
			}).getView()
			,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE});
			
		Ti.API.info("ADDROW:" + lastRow);
		lastRow = lastRow + 1;	
		resultSet.next();
	}

	resultSet.close();

	db.close();
	
	// just scroll down a bit to the new rows to bring them into view
	//$.tvRssList.scrollToIndex(lastRow-19,{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});

	baseActInd.hide();
	rowActInd.hide();
}

$.winNav.addEventListener("blur", function (e) {
	Ti.API.info("winNav blur");
	Alloy.Globals.EnableRss = true;
	//イベントリスーナー削除
	//Titanium.App.removeEventListener("EndRssList",CallEndRssList);
	Titanium.App.removeEventListener("EndLinks",CallEndLinks);
});


$.tvRssList.addEventListener('scroll',function(e)
{
	var offset = e.contentOffset.y;
	var height = e.size.height;
	var total = offset + height;
	var theEnd = e.contentSize.height;
	var distance = theEnd - total;

	// going down is the only time we dynamically load,
	// going up we can safely ignore -- note here that
	// the values will be negative so we do the opposite
	if (distance < lastDistance)
	{
		// adjust the % of rows scrolled before we decide to start fetching
		var nearEnd = theEnd * .75;

		if (!updating && (total >= nearEnd))
		{
			beginUpdate();
		}
	}
	lastDistance = distance;
});

//---------------------
// RSSからリンクリスト取得
//---------------------
/*
function GetLinkList(url,itemindex){
	rss.setUrl(url);
	rss.setUrlIndex(itemindex);

	rss.loadRssFeedDb({
		success: function(data) {
		},
		error:function(e){
			Ti.API.info("★★ERROR★★:[" + url + "](" + itemindex +")");
			var index = Number(itemindex) + 1;
			Ti.API.info("★condition:[" + _rssList.length + "]");
			if (_rssList.length >= index + 1){
				Ti.API.info("★NextGetLinkList:[" + _rssList[index] + "](" + index +")");
				GetLinkList(_rssList[index],index);
			}else{
				//読み込み終了
				Ti.API.info("GetLinkList:読み込み終了");
				
				//イベントリスーナー削除
				//Titanium.App.removeEventListener("EndRssList",CallEndRssList);
				Titanium.App.removeEventListener("EndLinks",CallEndLinks);
				
				//画面表示
				SetRssList();
				Alloy.Globals.EnableRss = false;
				$.btnRefresh.enabled = true;
			}
		}
	});
}
*/
//---------------------
// DBからRssリンクリスト表示
//---------------------
function SetRssList(){
	var db = Ti.Database.open('tRss');
	Ti.API.info("-----SetRssList tRss:" + db.file.getNativePath());
	db.execute('CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)');
		
	var resultSet = db.execute('SELECT id,title,url,pubDate FROM tRss ORDER BY pubDate DESC LIMIT 20');
	var rows = [];
	while (resultSet.isValidRow()){
		rows.push(Alloy.createController('row', {
				articleUrl: resultSet.fieldByName('url'),
				title: resultSet.fieldByName('title'),
				date:resultSet.fieldByName('pubDate')
			}).getView());
		//alert(resultSet.fieldByName('url'));
		resultSet.next();
	}

	resultSet.close();
	db.close();
	
	$.tvRssList.setData(rows);
}

//---------------------
// WebからRss取得
//---------------------

function Refresh(){
	if (Titanium.Network.online ==false){
		var dialog = Ti.UI.createAlertDialog({
			title:"ネットワーク接続できていません"
		});
		dialog.show();
		return;
	}　
	
	$.btnRefresh.enabled = false;
	
	//イベントリスーナー削除
	//Titanium.App.removeEventListener("EndRssList",CallEndRssList);
	Titanium.App.removeEventListener("EndLinks",CallEndLinks);
	
	var db = Ti.Database.open('tRss');
	Ti.API.info("~~~refresh tRSS DB :" + db.file.getNativePath());
	db.execute('CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)');
	db.execute('DELETE FROM tRss');
	db.execute("DELETE FROM sqlite_sequence WHERE name=?","tRss");
	db.close();
	
	//Titanium.App.addEventListener('EndRssList',CallEndRssList);
	Titanium.App.addEventListener('EndLinks',CallEndLinks);
	
	//RSS取得先URL
	Alloy.Globals.CurrentRss.url = 'http://bbspzdr.pad-plus.com/app_' + Alloy.Globals.CurrentRss.site + '.xml';
	rss.setUrl(Alloy.Globals.CurrentRss.url);
	rss.loadRssFeedDb({
		success: function(data) {
		},
		error:function(e){
			Ti.API.info("★★ERROR★★:[" + url + "]");
		}
	});
	
}
function btnRefresh_click(){
	
	Refresh();
	
}

//---------------------------
// Rss詳細画面を開く
//---------------------------
function tvRssList_click(e){
	
	var controller = Alloy.createController('webview',{
		url:e.row.articleUrl,
		title:e.row.articleTitle,
		toolbarVisible:true
	});
	var win = controller.getView();

	$.winNav.openWindow(win, {animated : true});
	Alloy.Globals.ActiveNav = $.winNav;
}

function tabbedbar_click(e) {
	Ti.API.info("::::INDEX::::" + e.source.index);
	switch(e.source.index){
		case 1:
			var index = Alloy.createController('index').getView();
			index.open();
			break;
		case 2:
			var favorite = Alloy.createController('favorite').getView();
			favorite.open();
			break;
		case 3:
			var popular = Alloy.createController('popular').getView();
			popular.open();
			break;
		case 4:
			$.btnTab1.backgroundImage = "/bn_newarticle_off.png";
			$.btnTab2.backgroundImage = "/bn_favorite_off.png";
			$.btnTab3.backgroundImage = "/bn_populararticles_off.png";
			$.btnTab4.backgroundImage = "/bn_rss_on.png";
			$.btnMenu.backgroundImage = "/bn_siteselection_off.png";
			break;
		default:
			break;
	}
}

function btnMenu_LongPress(e) {
	Ti.API.info("::::btnMenu_LongPress::::");
	$.btnTab1.backgroundImage = "/bn_newarticle_off.png";
	$.btnTab2.backgroundImage = "/bn_favorite_off.png";
	$.btnTab3.backgroundImage = "/bn_populararticles_off.png";
	$.btnTab4.backgroundImage = "/bn_rss_off.png";
	$.btnMenu.backgroundImage = "/bn_siteselection_on.png";
	Ti.App.fireEvent('MenuButtonClick');

}

//---------------
// サイト選択menu
//---------------
function SetMenu(){
	
	//.tvTab2.editing = false;
	//Ti.API.info('tab5Click');
	
	var menu = require('/path').createMenu({
		iconList: [
			{ image: '/rss1.png', id: 'rss1' },
			{ image: '/rss2.png', id: 'rss2' },
			{ image: '/rss3.png', id: 'rss3' },
			{ image: '/rss4.png', id: 'rss4' },
			{ image: '/clear.png', id: 'rss5' }
		]
	});
	menu.opacity=0;
	menu.addEventListener('iconClick', function(e) {
		Ti.API.info(e.source);
		Ti.API.info(e.index);
		Ti.API.info(e.id);
		//alert('index: ' + e.index + '\nid: ' + (e.id ? e.id : 'undefined'));
		var title,site,url;
		switch( e.index ) {
		    case 0:
		    	title = Alloy.Globals.Rss.rss1.title;
		    	site = Alloy.Globals.Rss.rss1.site;
		    	url = 'http://bbspzdr.pad-plus.com/app_' + Alloy.Globals.Rss.rss1.site + '.xml';
		        break;
		    case 1:
		        title = Alloy.Globals.Rss.rss2.title;
		    	site = Alloy.Globals.Rss.rss2.site;
		    	url = 'http://bbspzdr.pad-plus.com/app_' + Alloy.Globals.Rss.rss2.site + '.xml';
		        break;
	        case 2:
	        	title = Alloy.Globals.Rss.rss3.title;
		    	site = Alloy.Globals.Rss.rss3.site;
		    	url = 'http://bbspzdr.pad-plus.com/app_' + Alloy.Globals.Rss.rss3.site + '.xml';
	        	break;
	        case 3:
	        	title = Alloy.Globals.Rss.rss4.title;
		    	site = Alloy.Globals.Rss.rss4.site;
		    	url = 'http://bbspzdr.pad-plus.com/app_' + Alloy.Globals.Rss.rss4.site + '.xml';
	        	break;
	        case 4:
	        	title = Alloy.Globals.Rss.rss5.title;
		    	site = Alloy.Globals.Rss.rss5.site;
		    	url = 'http://bbspzdr.pad-plus.com/app_' + Alloy.Globals.Rss.rss5.site + '.xml';
	        break;	
		}
		
		Alloy.Globals.CurrentRss = { "title":title,"site":site,"url":url};
		
		//RSS URL一覧　変数初期か
		_rssList = [];
		baseActInd.show();
		var rows = [];
		$.tvRssList.setData(rows);
		Refresh();

	});
	$.winNav.add(menu);
	
}
/*
$.winNav.addEventListener("postlayout", function (e) {
	Ti.API.info("winNav postlayout");

});
*/

//Ti.API.info("::::SIZE::::" + Ti.Platform.displayCaps.platformWidth);
//Ti.API.info((Ti.Platform.displayCaps.platformWidth / 5) + "dp");
$.winNav.open();
Alloy.Globals.ActiveNav = $.winNav;
