var args = arguments[0] || {};

$.list.rowId = args.rowId;
$.list.parentId = args.parentId;
$.list.Title = args.title;
$.list.Url = args.url;
$.list.type = args.type;
$.list.isView = args.isView;
$.list.isDel = args.isDel;

var moment = require("alloy/moment");
var _title = "";
var _parentId = 0;

if ($.list.isDel){
	$.btnRight.title = "編集";
}
//---------------------------
// folderリスト表示
//---------------------------
function GetList(){
	var rowList = [];
	var db = Ti.Database.open('bookmarks');
	db.execute('CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)');
	
	
	//テストデータ
	//db.execute('DELETE FROM bookmarks');
	/*
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',0,0,'yahoo','http://www.yahoo.co.jp');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',0,0,'google','http://www.google.com');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',0,0,'youtube','http://www.youtube.com');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',1,1,'folder1',null);
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',2,1,'folder2',null);
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',3,1,'folder3',null);
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',1,0,'folder1file1','http://www.yahoo.co.jp');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',2,0,'folder2file1','http://www.google.com');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',3,0,'folder3file1',null);
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',1,0,'folder1file2','http://www.yahoo.co.jp');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',2,0,'folder2file2','http://www.google.com');
	db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',3,0,'folder3file2','http://www.youtube.com');
	*/
	var resultSet;

	if ($.list.parentId == null || $.list.parentId == 0){
		resultSet = db.execute('SELECT id,title,url,parent_id,type FROM bookmarks WHERE type=1');
	}else{
		resultSet = db.execute('SELECT id,title,url,parent_id,type FROM bookmarks WHERE type=0 and parent_id = ?',$.list.parentId);
	}

	var image;
	var rows = [];
	while (resultSet.isValidRow()){
		
		if (resultSet.fieldByName('type') == 0){
			image = "/bookmark.png";
		}else{
			image = "/folder.png";
		}
		
		rows.push(Alloy.createController('bm_row', {
				parentId: resultSet.fieldByName('parent_id'),
				title: resultSet.fieldByName('title'),
				type:resultSet.fieldByName('type'),
				url:resultSet.fieldByName('url'),
				image: image,
				rowId:resultSet.fieldByName('id')
			}).getView());
		
		resultSet.next();
	}

	resultSet.close();
	db.close();
	$.tvBookmark.setData(rows);

}

GetList();


//---------------------------
// folder追加表示
//---------------------------
function AddFolder(value){
	
	var db = Ti.Database.open('bookmarks');
	db.execute('CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)');
	
	var resultSet = db.execute('SELECT MAX(parent_id) max_parent FROM bookmarks');
	//var resultSet = db.execute('SELECT title,url,parent_id FROM tbookmark');

	var max_id = 1;
	if (resultSet.isValidRow()){
		max_id = resultSet.fieldByName('max_parent') + 1;
	}
	resultSet.close();

	db.execute('INSERT INTO bookmarks (parent_id,type,title) VALUES (?,?,?)',max_id,1,value);
	
	var resultSet2 = db.execute('SELECT title,parent_id,type,url FROM bookmarks WHERE type=?',1);
	
	var image;
	var rows = [];
	while (resultSet2.isValidRow()){
		
		if (resultSet2.fieldByName('type') == 0){
			image = "/bookmark.png";
		}else{
			image = "/folder.png";
		}
		
		rows.push(Alloy.createController('bm_row', {
				parentId: resultSet2.fieldByName('parent_id'),
				title: resultSet2.fieldByName('title'),
				type:resultSet2.fieldByName('type'),
				url:resultSet2.fieldByName('url'),
				image: image
			}).getView());
		
		resultSet2.next();
	}
	
	resultSet2.close();

	db.close();
	$.tvBookmark.setData(rows);
}

//---------------------------
// TableView行選択イベント
//---------------------------
function tvBookmark_click(e){
	
	if ($.list.isView){
		var controller = Alloy.createController('webview',{
			url:e.row.Url,
			title:e.row.Title
		});
		var win = controller.getView();
		Alloy.Globals.ActiveNav.openWindow(win, {animated : true});
	}else{
		_title = e.row.Title;
		_parentId = e.row.parentId;
		Ti.API.info("selected title:" + e.row.Title);
		Ti.API.info("selected parentId:" + e.row.parentId);
		$.list.close();
	}
}

//---------------------------
// TableView Row Deleteイベント
//---------------------------
function tvBookmark_delete(e){

	if (e.row.rowId){
		var db = Ti.Database.open('bookmarks');
		db.execute('DELETE FROM bookmarks WHERE id = ?',e.row.rowId);
		db.close();
	}
}

//---------------------------
// 右ボタンイベント
// 新規フォルダ || 削除ボタン
//---------------------------
function btnRight_click(e){

	if ($.list.isDel){
		if ($.tvBookmark.editing){
			$.tvBookmark.editing = false;
			$.btnRight.title = "編集";
		}else{
			$.tvBookmark.editing = true;
			$.btnRight.title = "完了";
		}
	}else{
		$.dialog.show();
	}
}

//---------------------------
// dialogのComfirmイベント
//---------------------------
function dialog_click(e){
	if (e.index === 0){
      //OK
 		if (e.text.length == 0){
 			alert('フォルダ名を入力してください');
 		}else{
 			AddFolder(e.text);
 		}
    }
    //Ti.API.info('e.text: ' + e.text);
    //alert('e.cancel: ' + e.cancel);
    //alert('e.source.cancel: ' + e.source.cancel);
    //alert('e.index: ' + e.index);
};

exports.getTitle = function() {
	return _title;
};

exports.getParentId = function() {
	return _parentId;
};

function doneConfirm(){
	$.list.close();
}