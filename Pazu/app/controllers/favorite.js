var platFormWidth = Ti.Platform.displayCaps.platformWidth;
var unitWidth = platFormWidth / 5;
$.btnTab1.left = "0dp";
$.btnTab2.left = unitWidth + "dp";
$.btnTab2.backgroundImage = "/bn_favorite_on.png";
$.btnTab3.left = (unitWidth * 2) +"dp";
$.btnTab4.left = (unitWidth * 3) + "dp";
$.btnMenu.left = (unitWidth * 4) + "dp";

SetMenu();
FavoriteLoad();
//---------------
// お気に入り
//---------------
function FavoriteLoad(){
	$.tvFavorite.editing = false;
	$.btnEdit.title = "編集";
	GetBookmarks();
	
}

//---------------------------
// ブックマークリスト取得
//---------------------------
function GetBookmarks(){
	
	var db = Ti.Database.open('bookmarks');
	Ti.API.info(db.file.getNativePath());
	
	db.execute('CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)');
	
	var resultSet = db.execute('SELECT id,parent_id,type,title,url FROM bookmarks WHERE type = 1 UNION ALL SELECT id,parent_id,type,title,url FROM bookmarks WHERE type = 0 AND parent_id = 0');

	var image;
	var hasChild;
	var rows = [];
	while (resultSet.isValidRow()){
		
		if (resultSet.fieldByName('type') == 0){
			image = "/bookmark.png";
			hasChild = false;
		}else{
			image = "/folder.png";
			hasChild = true;
		}
		
		rows.push(Alloy.createController('bm_row', {
				parentId: resultSet.fieldByName('parent_id'),
				title: resultSet.fieldByName('title'),
				type:resultSet.fieldByName('type'),
				url:resultSet.fieldByName('url'),
				image: image,
				hasChild:hasChild,
				rowId:resultSet.fieldByName('id'),
			}).getView());
		
		resultSet.next();
	}

	resultSet.close();
	db.close();
	$.tvFavorite.setData(rows);
}

//---------------------------
// お気に入り
// タプ２のTableViewクリックイベント
//---------------------------
function tvFavorite_click(e){
	//alert(e.row.type);
	//alert(e.row.Title);
	//alert(e.row.Url);
	
	if (e.row.type == 0){
		//ファイル
		//詳細画面
		var controller = Alloy.createController('webview',{
			title:e.row.Title,
			url:e.row.Url,
			toolbarVisible:false
		});
		var win = controller.getView();
	
		Alloy.Globals.ActiveNav.openWindow(win, {animated : true});
	}else{
		//フォルダ
		//フォルダ内のリスト画面
		var controller = Alloy.createController('list',{
			parentId:e.row.parentId,
			isView:true,
			isDel:true,
			rowId:e.row.rowId
		});
				
		var win = controller.getView();
		win.addEventListener('click',function(e){
			/*
			if (controller.getTitle() != "") {
			 $.rowFolder.title = controller.getTitle();
			 _dirId = controller.getParentId();
			}
			*/
		});
		Alloy.Globals.ActiveNav.openWindow(win, {animated : true});
	}

}

//---------------------------
// 行削除
//---------------------------
function tvFavorite_delete(e){
	//alert(e.row.rowId);
	//alert(e.row.type);
	
	 var db = Ti.Database.open('bookmarks');
    if (e.row.type == 1){
		//folder
		db.execute('DELETE FROM bookmarks WHERE parent_id = ?',e.row.parentId);
	}else{
		//file
		db.execute('DELETE FROM bookmarks WHERE id = ?',e.row.rowId);
	}
	db.close();
	
}

//---------------------------
// 右ボタンイベント
// 削除ボタン
//---------------------------
function btnEdit_click(e){

	if ($.tvFavorite.editing){
		$.tvFavorite.editing = false;
		$.btnEdit.title = "編集";
	}else{
		$.tvFavorite.editing = true;
		$.btnEdit.title = "完了";
	}
	
}


function tabbedbar_click(e) {
	Ti.API.info("::::INDEX::::" + e.source.index);
	switch(e.source.index){
		case 1:
		var index = Alloy.createController('index').getView();
			index.open();
			break;
		case 2:
			$.btnTab1.backgroundImage = "/bn_newarticle_off.png";
			$.btnTab2.backgroundImage = "/bn_favorite_on.png";
			$.btnTab3.backgroundImage = "/bn_populararticles_off.png";
			$.btnTab4.backgroundImage = "/bn_rss_off.png";
			$.btnMenu.backgroundImage = "/bn_siteselection_off.png";
			//Ti.App.fireEvent('MenuButtonClick');
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
	
	//.tvFavorite.editing = false;
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
		
		var index = Alloy.createController('index').getView();
		index.open();

	});
	$.winNav.add(menu);
	
}

//Ti.API.info("::::SIZE::::" + Ti.Platform.displayCaps.platformWidth);
//Ti.API.info((Ti.Platform.displayCaps.platformWidth / 5) + "dp");
$.winNav.open();
Alloy.Globals.ActiveNav = $.winNav;
