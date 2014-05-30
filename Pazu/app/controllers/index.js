var platFormWidth = Ti.Platform.displayCaps.platformWidth;
var unitWidth = platFormWidth / 5;
$.btnTab1.left = "0dp";
$.btnTab1.backgroundImage = "/bn_newarticle_on.png";
$.btnTab2.left = unitWidth + "dp";
$.btnTab3.left = (unitWidth * 2) +"dp";
$.btnTab4.left = (unitWidth * 3) + "dp";
$.btnMenu.left = (unitWidth * 4) + "dp";

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
if(Ti.Platform.osname === 'android'){
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

$.winNewArticle.add(adView);

//---------------------------
//メニューコントロールセット
//---------------------------
SetMenu();

//---------------------------
//新規記事RSS表示
//---------------------------
var rss = require('rss');
var _rssList = [];

//---------------------------
//　ページロード
//---------------------------
Refresh();

function Refresh() {
	Ti.API.info("::::btnRefresh_click::::");
	if (Titanium.Network.online ===false){
		var dialog = Ti.UI.createAlertDialog({
			title:"ネットワーク接続できていません"
		});
		dialog.show();
		return;
	}
	Alloy.Globals.CurrentRss.url = 'http://' + Alloy.Globals.CurrentRss.site + '/feed';
	rss.loadRssFeed({
		success: function(data) {
			var rows = [];
			_.each(data, function(item) {
				rows.push(Alloy.createController('row', {
					articleUrl: item.link,
					title: item.title,
					date: item.pubDate
				}).getView());
			});
			$.tvTab1.setData(rows);
		}
	});
}
//---------------------------
// Rss Refresh
//---------------------------
function btnRefresh_click() {
	Refresh();
}

//---------------------------
// 検索バーを表示する
//---------------------------
function btnSearch_click() {
	Ti.API.info("::::btnSearch_click::::");
	
	if (Alloy.Globals.searchBar){
		//alert('ok');
		if (Alloy.Globals.searchBar.visible == true){
			
			Alloy.Globals.searchBar.visible = false;
			//Alloy.Globals.searchBar.hide({animated : true});
			
		}else{
			Alloy.Globals.searchBar.visible = true;
			Alloy.Globals.searchBar.show({animated : true});
		}
		
	}else{
		//alert('ng');
		AddSearchBar();
	}
}

//---------------------------
// 検索バーCreate
//---------------------------
function AddSearchBar(){
	
	var search = Titanium.UI.createSearchBar({
		id:"barSearch",
	    showCancel:true,
	    visible:true,
	    top:0,
	    animated : true
	});
	$.tvTab1.add(search);
	
	Alloy.Globals.searchBar = search;

	// 内容変化時のイベント
	search.addEventListener('change', function(e){
	        //Titanium.API.info('search bar: you type ' + e.value + ' act val ' + search.value);
	});
	// cancelボタンクリック時イベント
	search.addEventListener('cancel', function(e){
	        //Titanium.API.info('search bar cancel fired');
	        e.source.hide();
	        search.blur();
	});
	// 内容確定時イベント
	search.addEventListener('return', function(e){
	        //Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
	        //$.table.search = null;
        search.blur();
        e.source.hide();
	        
		var controller = Alloy.createController('webview',{
			url:'http://' + Alloy.Globals.CurrentRss.site + "/?s=" + search.value,
			toolbarVisible:true
		});
		var win = controller.getView();
		$.winNav.openWindow(win, {animated : true});
		
	});
	// フォーカスの取得・喪失時イベント
	search.addEventListener('focus', function(e){
	        Ti.API.info('search bar: focus received');
	});
	search.addEventListener('blur', function(e){
	        Titanium.API.info('search bar:blur received');
	});

}

//---------------------------
// 新規記事
// タブ１のTableViewクリックイベント
// Rss詳細画面を開く
//---------------------------
function tvTab1_click(e){
	
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
			$.btnTab1.backgroundImage = "/bn_newarticle_on.png";
			$.btnTab2.backgroundImage = "/bn_favorite_off.png";
			$.btnTab3.backgroundImage = "/bn_populararticles_off.png";
			$.btnTab4.backgroundImage = "/bn_rss_off.png";
			$.btnMenu.backgroundImage = "/bn_siteselection_off.png";
			//Ti.App.fireEvent('MenuButtonClick');
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
			var rsslist = Alloy.createController('rsslist').getView();
			rsslist.open();
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
		    	url = 'http://' + Alloy.Globals.Rss.rss1.site + '/feed';
		        break;
		    case 1:
		        title = Alloy.Globals.Rss.rss2.title;
		    	site = Alloy.Globals.Rss.rss2.site;
		    	url = 'http://' + Alloy.Globals.Rss.rss2.site + '/feed';
		        break;
	        case 2:
	        	title = Alloy.Globals.Rss.rss3.title;
		    	site = Alloy.Globals.Rss.rss3.site;
		    	url = 'http://' + Alloy.Globals.Rss.rss3.site + '/feed';
	        	break;
	        case 3:
	        	title = Alloy.Globals.Rss.rss4.title;
		    	site = Alloy.Globals.Rss.rss4.site;
		    	url = 'http://' + Alloy.Globals.Rss.rss4.site + '/feed';
	        	break;
	        case 4:
	        	title = Alloy.Globals.Rss.rss5.title;
		    	site = Alloy.Globals.Rss.rss5.site;
		    	url = 'http://' + Alloy.Globals.Rss.rss5.site + '/feed';
	        break;	
		}
		
		Alloy.Globals.CurrentRss = { "title":title,"site":site,"url":url};
		
		Refresh();

	});
	$.winNav.add(menu);
	
}

//Ti.API.info("::::SIZE::::" + Ti.Platform.displayCaps.platformWidth);
//Ti.API.info((Ti.Platform.displayCaps.platformWidth / 5) + "dp");
/*
$.winNav.addEventListener("close", function () {
	Ti.API.info("index_page close');
  	$.destroy();
});
*/

$.winNav.open();
Alloy.Globals.ActiveNav = $.winNav;