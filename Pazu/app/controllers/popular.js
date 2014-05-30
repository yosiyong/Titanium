var platFormWidth = Ti.Platform.displayCaps.platformWidth;
var unitWidth = platFormWidth / 5;
$.btnTab1.left = "0dp";
$.btnTab2.left = unitWidth + "dp";
$.btnTab3.left = (unitWidth * 2) +"dp";
$.btnTab3.backgroundImage = "/bn_populararticles_on.png";
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
$.popular.add(baseActInd);

//---------------------------
//　メニューコントロールセット
//---------------------------
SetMenu();

//---------------
// 人気記事
//---------------

//---------------------------
//　ページロード
//---------------------------
PoupularLoad();

function PoupularLoad(){
	$.wbWebView.url = 'http://' + Alloy.Globals.CurrentRss.site + '/app_fav';
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
			$.btnTab1.backgroundImage = "/bn_newarticle_on.png";
			$.btnTab2.backgroundImage = "/bn_favorite_off.png";
			$.btnTab3.backgroundImage = "/bn_populararticles_onf.png";
			$.btnTab4.backgroundImage = "/bn_rss_off.png";
			$.btnMenu.backgroundImage = "/bn_siteselection_off.png";
			//Ti.App.fireEvent('MenuButtonClick');
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
		
		tab3Click();

	});
	$.popular.add(menu);
	
}

//Ti.API.info("::::SIZE::::" + Ti.Platform.displayCaps.platformWidth);
//Ti.API.info((Ti.Platform.displayCaps.platformWidth / 5) + "dp");
$.popular.open();
