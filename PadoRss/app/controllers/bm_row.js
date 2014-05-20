var args = arguments[0] || {};

$.bm_row.parentId = args.parentId;
$.bm_row.Title = args.title;
$.bm_row.Url = args.url;
$.bm_row.type = args.type;
$.image.image = args.image;
$.title.text = args.title;
$.bm_row.hasChild = args.hasChild;
$.bm_row.rowId = args.rowId;

function deleteTask(e) {
	Ti.API.info("--bm_row.js--deleteTask start");
	
	// prevent bubbling up to the row
	e.cancelBubble = true;
	 var db = Ti.Database.open('bookmarks');
    if ($.bm_row.type == 1){
		//folder
		db.execute('DELETE FROM bookmarks WHERE parent_id = ?',$.bm_row.parentId);
	}else{
		//file
		db.execute('DELETE FROM bookmarks WHERE id = ?',$.bm_row.rowId);
	}
	db.close();
	
	Ti.App.fireEvent('foo');
	
	Ti.API.info("--bm_row.js--deleteTask end");
}