
//---------------------------
//新規記事RSS表示
//---------------------------
var rss = require('rss');
var _rssList = [];

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

function SetIndicator(flag){
	
	if (indicatorAdded == false){
		$.winNewArticle.add(baseActInd);
		indicatorAdded = true;
	}
		
	if (flag){
		Ti.API.info("---index.js SetIndicator add---:");
		baseActInd.show();
	}else{
		
		Ti.API.info("---index.js SetIndicator remove---:");
		baseActInd.message = null;
		baseActInd.width = Ti.UI.SIZE;
		baseActInd.hide();
	}
	
}

var debug = '';
//---------------------------
//ボタン配置
//---------------------------
SetButton();
function SetButton(){
	
	$.btnTab1.backgroundImage = "/bn_newarticle_on.png";
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
	
	//debug = ":platformWidth:" + platFormWidth + ":buttonWidth:" + buttonWidth + "wth:" + wth + ":allspace:" + asp + ":space:" + sp + ':$.btnTab2.left:'+ unitWidth + ':$.btnTab3.left:'+ (unitWidth * 2) + ':$.btnTab4.left :'+ (unitWidth * 3);

	
/*
 * Ti.API.info("btnMenu left:" + $.btnMenu.left);
	Ti.API.info("btnMenu top:" + $.btnMenu.top);
	Ti.API.info("btnMenu bottom:" + $.btnMenu.bottom);
	Ti.API.info("btnMenu width:" + $.btnMenu.width);
	Ti.API.info("btnMenu height:" + $.btnMenu.height);

	Ti.API.info("::::platformWidth::::" + Ti.Platform.displayCaps.platformWidth);
	Ti.API.info("::::buttonWidth::::" + buttonWidth);
	Ti.API.info("::::wth::::" + wth);
	Ti.API.info("::::wth2::::" + wth2);
	Ti.API.info("::::sp::::" + sp);
	Ti.API.info("::::unitWidth::::" + unitWidth);
*/
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

$.winNewArticle.add(adView);

//---------------------------
//メニューコントロールセット
//---------------------------
SetMenu();

//---------------------------
//　ページロード
//---------------------------
Refresh();

function Refresh() {
	Ti.API.info("::::btnRefresh_click::::");
	
	SetIndicator(true);
	
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
	
	SetIndicator(false);
}

//---------------------------
// Rss Refresh
//---------------------------
function btnRefresh_click() {
	
	setTimeout(function()
	{
		Refresh();
	},1000);
	
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
			//Alloy.Globals.searchBar.show({animated : true});
		}
		
	}else{

		AddSearchBar();
	}
}

function AddSearchBar(){
	var search = Titanium.UI.createSearchBar({
		id:"barSearch",
		barColor:'#385292',
	    showCancel:false,
	    visible:true,
	    top:Alloy.Globals.tableTop,
	    animated : true
	});
	search.height = 100;
	$.winNewArticle.add(search);

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
		//$.winNav.openWindow(win, {animated : true});
		win.open({animated:true});
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

	win.open({animated:true});
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

function btnTab_click(e) {
	Ti.API.info("::::btnTab1_click::::" + e.source.index);

	switch(e.source.index){
		case 1:
			$.btnTab1.backgroundImage = "/bn_newarticle_on.png";
			$.btnTab2.backgroundImage = "/bn_favorite_off.png";
			$.btnTab3.backgroundImage = "/bn_populararticles_off.png";
			$.btnTab4.backgroundImage = "/bn_rss_off.png";
			$.btnMenu.backgroundImage = "/bn_siteselection_off.png";

			break;
		case 2:
			var favorite = Alloy.createController('favorite').getView();
			favorite.open({animated:true});
			break;
		case 3:
			var popular = Alloy.createController('popular').getView();
			popular.open({animated:true});
			break;
		case 4:
			var rsslist = Alloy.createController('rsslist').getView();
			rsslist.open({animated:true});
			break;
		default:
			break;
	}
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
		//Ti.API.info(e.source);
		Ti.API.info('index.js iconClick:' + e.index);
		Ti.API.info('index.js iconClick:' + e.id);
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
		setTimeout(function()
		{
			menu.initMenu(true);
		},1000);
	});

	$.winNewArticle.add(menu);
	
}


$.winNewArticle.open({animated:true});
//alert(debug);
//Alloy.Globals.ActiveNav = $.winNewArticle;
