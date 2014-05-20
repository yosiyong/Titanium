//---------------------------
//ボタン配置
//---------------------------
SetButton();

function SetButton(){
	Ti.API.info("--SetButton start---");
	
	$.btnTab4.backgroundImage = "/bn_rss_on.png";
	var platFormWidth = Ti.Platform.displayCaps.platformWidth;

	if (platFormWidth > 480){
		
		var wid = $.btnTab1.width;
		var end = wid.indexOf('dp');
		var buttonWidth = parseInt(wid.substring(0,end));
		
		var wth = (platFormWidth - (buttonWidth*2));
		var asp = wth - (buttonWidth*3);
		var sp = asp / 4;
		unitWidth = buttonWidth + sp;
		
		if (platFormWidth > 900){
			unitWidth = unitWidth - 30;
		}else{
			unitWidth = unitWidth - 10;
		}
		
		$.btnTab1.left = 0;
		$.btnTab2.left = unitWidth;
		$.btnTab3.left = (unitWidth * 2);
		$.btnTab4.left = (unitWidth * 3);
		$.btnMenu.right =0;
		
	}else{
		$.footer.layout = 'horizontal';
		$.btnTab1.left = 0;
		$.btnMenu.right =0;
	}
}


//---------------------------
// 広告
//---------------------------

var ad = require('net.nend');
var adView;
if(Ti.Platform.osname === 'android'){
    adView = ad.createView({
        spotId: 118486,
        apiKey: "190809b6d2c6a1f08ef90c2bf293ec978f1cc220",
        width: '320dp',
        height: '50dp',
        bottom: '50dp'
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

var baseActInd = Titanium.UI.createActivityIndicator({
	width : Ti.UI.SIZE,
	height : Ti.UI.SIZE
});
	
var ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;

if (ActivityIndicatorStyle) {
	baseActInd.style = ActivityIndicatorStyle.BIG_DARK;
}
var indicatorAdded = false;
var indicatorVisible = false;


//---------------------------
//　メニューコントロールセット
//---------------------------
SetMenu();

//---------------------------
// RSS
//---------------------------
var rss = require('rss');

var lastDistance = 0; // calculate location to determine direction
var lastRow = 20;
	

var updating = false;

var loadingRow = Ti.UI.createTableViewRow();
/*
var rowActInd = Ti.UI.createActivityIndicator({
	    left: 100,
	    height: 50,
	    width: 10
});
*/

CallEndLinks = function(e){
	Ti.API.info("--CallendLinks start---");
	
	Ti.API.info("★EndLinks:[" + e.param1 + "](" + e.param2 +")");
	
	//読み込み終了
	Ti.API.info("CallEndLinks:画面表示処理");
	
	//イベントリスーナー削除
	Titanium.App.removeEventListener("EndLinks",CallEndLinks);
	
	//画面表示
	SetRssList();
	Alloy.Globals.EnableRss = false;
	$.btnRefresh.enabled = true;

	SetIndicator(false);
	
	Ti.API.info("--CallendLinks end---");
};


//---------------------------
//　ページロード
//---------------------------
RssListLoad();

function RssListLoad(){
	
	Ti.API.info("--RssListLoad start---:" + Alloy.Globals.EnableRss);
	
	if (Alloy.Globals.EnableRss === true){
		lastDistance = 0; // calculate location to determine direction
		lastRow = 20;
		updating = false;

		Refresh();
	}
	
	Ti.API.info("--RssListLoad end---");
}


function beginUpdate()
{
	Ti.API.info("--beginUpdate start---");
	updating = true;
	
	SetIndicator(true);
	/*
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
	*/
	$.tvRssList.appendRow(loadingRow);
	Ti.API.info("ADD LOAD ROW:" + lastRow);

	// just mock out the reload
	setTimeout(endUpdate,2000);
	
	Ti.API.info("--beginUpdate end---");
}
	
function endUpdate()
{
	Ti.API.info("--endUpdate start---");
	updating = false;

	$.tvRssList.deleteRow(lastRow);
	Ti.API.info("DELETE ROW:" + lastRow);
	
	var db = Ti.Database.open('tRss');
	//alert(db.file.getNativePath());
	db.execute('CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)');
	
	//lastRow + 1行目から２０件取得	
	var resultSet = db.execute('SELECT id,title,url,pubDate FROM tRss ORDER BY pubDate DESC LIMIT 20 OFFSET ?', lastRow);
	
	while (resultSet.isValidRow()){
		
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

	//baseActInd.hide();
	//rowActInd.hide();
	
	SetIndicator(false);
	Ti.API.info("--endUpdate end---");
}

$.winRssList.addEventListener("blur", function (e) {
	Ti.API.info("--winRssList blur start--");
	
	Alloy.Globals.EnableRss = true;
	//イベントリスーナー削除
	Titanium.App.removeEventListener("EndLinks",CallEndLinks);
	
	Ti.API.info("--winRssList blur end--");
});


$.tvRssList.addEventListener('scroll',function(e)
{
	Ti.API.info("--scroll start---");
	/*
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
	*/
	
	var itemcnt = e.firstVisibleItem + e.visibleItemCount;
	/*
	Ti.API.info("firstVisibleItem:" + e.firstVisibleItem);
	Ti.API.info("visibleItemCount:" + e.visibleItemCount);
	Ti.API.info("e.firstVisibleItem + e.visibleItemCount:" + itemcnt);
	Ti.API.info("totalItemCount:" + e.totalItemCount);
	*/
	if (itemcnt == e.totalItemCount-2)
	{
		if (!updating)
		{
			beginUpdate();
		}
	}
	
	Ti.API.info("--scroll end---");
});


$.tvRssList.addEventListener('scrollEnd',function(e)
{
	Ti.API.info("-----tvRssList scrollEnd:");
	
});


//---------------------
// DBからRssリンクリスト表示
//---------------------
function SetRssList(){
	Ti.API.info("---SetRssList start---:");
	
	var db = Ti.Database.open('tRss');
	//Ti.API.info("-----SetRssList tRss:" + db.file.getNativePath());
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
	
	Ti.API.info("---SetRssList end---:");
}


function SetIndicator(flag){
	
	if (flag){
		Ti.API.info("---SetIndicator add---:");
		
		if (indicatorAdded == false){
			$.winRssList.add(baseActInd);
			indicatorAdded = true;
		}
		baseActInd.show();
		
	}else{
		
		Ti.API.info("---SetIndicator remove---:");
		baseActInd.message = null;
		baseActInd.width = Ti.UI.SIZE;
		baseActInd.hide();
		//$.winRssList.remove(baseActInd);
	}
	
}
//---------------------
// WebからRss取得
//---------------------

function Refresh(){
	Ti.API.info("---Refresh---:");
	
	if (Titanium.Network.online ==false){
		var dialog = Ti.UI.createAlertDialog({
			title:"ネットワーク接続できていません"
		});
		dialog.show();
		return;
	}
	
	SetIndicator(true);
	
	$.btnRefresh.enabled = false;
	
	//イベントリスーナー削除
	Titanium.App.removeEventListener("EndLinks",CallEndLinks);
	
	var db = Ti.Database.open('tRss');
	//Ti.API.info("~~~refresh tRSS DB :" + db.file.getNativePath());
	db.execute('CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)');
	db.execute('DELETE FROM tRss');
	db.execute("DELETE FROM sqlite_sequence WHERE name=?","tRss");
	db.close();
	
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
	Ti.API.info("---btnRefresh_click---:");
	
	$.tvRssList.setData([]);
	setTimeout(function()
	{
		Refresh();
	},1000);
}

//---------------------------
// Rss詳細画面を開く
//---------------------------
function tvRssList_click(e){
	Ti.API.info("---tvRssList_click---:");
	var controller = Alloy.createController('webview',{
		url:e.row.articleUrl,
		title:e.row.articleTitle,
		toolbarVisible:true
	});
	var win = controller.getView();

	win.open({animated:true});

}

function btnTab_click(e) {
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
		
		var rows = [];
		$.tvRssList.setData(rows);
	
		Refresh();
		setTimeout(function()
		{
			menu.initMenu(true);
		},1000);
	});
	$.winRssList.add(menu);
	
}


$.winRssList.open();
//Alloy.Globals.ActiveNav = $.winRssList;


