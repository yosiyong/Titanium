var args = arguments[0] || {};

$.lblUrl.text = args.url;
$.txtTitle.value = args.value;

var _dirId = 0;
//---------------------
//フォルダリスト画面を開く
//---------------------
function openFolder(){
	var controller = Alloy.createController('list');
	var win = controller.getView();
	
	win.addEventListener('close',function(e){

		if (controller.getTitle() != "") {
			 $.lblFolder.text = controller.getTitle();
			 _dirId = controller.getParentId();
		 
		 	Ti.API.info("passed getTitle:"+controller.getTitle());
		 	Ti.API.info("passed parentId:"+controller.getParentId());
		}
	});
	Alloy.Globals.ActiveNav.openWindow(win, {animated : true});
}

//---------------
//ブックマーク保存
//---------------
function saveBookmark(){
    var parent_id;
    
	if (_dirId == 0){
		//ルート直下に保存
		parent_id = 0;
	}else{
		//フォルダ指定保存
		parent_id = _dirId;
	}
	
	Ti.API.info("parent_id:" + parent_id);
	Ti.API.info("title:" +$.txtTitle.value);
    Ti.API.info("url:" +$.lblUrl.text);
    
    if ($.txtTitle.value == "" || $.lblUrl.text == ""){
    	alert("タイトルを入力してください。");
    }else{
 	    var db = Ti.Database.open('bookmarks');
		db.execute('CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)');
		db.execute('INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)',parent_id,0,$.txtTitle.value,$.lblUrl.text);
		db.close();
		$.winAdd.close();
	}
}