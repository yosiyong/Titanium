function Controller() {
    function GetList() {
        var db = Ti.Database.open("bookmarks");
        db.execute("CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)");
        var resultSet;
        resultSet = null == $.list.parentId || 0 == $.list.parentId ? db.execute("SELECT id,title,url,parent_id,type FROM bookmarks WHERE type=1") : db.execute("SELECT id,title,url,parent_id,type FROM bookmarks WHERE type=0 and parent_id = ?", $.list.parentId);
        var image;
        var rows = [];
        while (resultSet.isValidRow()) {
            image = 0 == resultSet.fieldByName("type") ? "/bookmark.png" : "/folder.png";
            rows.push(Alloy.createController("bm_row", {
                parentId: resultSet.fieldByName("parent_id"),
                title: resultSet.fieldByName("title"),
                type: resultSet.fieldByName("type"),
                url: resultSet.fieldByName("url"),
                image: image,
                rowId: resultSet.fieldByName("id")
            }).getView());
            resultSet.next();
        }
        resultSet.close();
        db.close();
        $.tvBookmark.setData(rows);
    }
    function AddFolder(value) {
        var db = Ti.Database.open("bookmarks");
        db.execute("CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)");
        var resultSet = db.execute("SELECT MAX(parent_id) max_parent FROM bookmarks");
        var max_id = 1;
        resultSet.isValidRow() && (max_id = resultSet.fieldByName("max_parent") + 1);
        resultSet.close();
        db.execute("INSERT INTO bookmarks (parent_id,type,title) VALUES (?,?,?)", max_id, 1, value);
        var resultSet2 = db.execute("SELECT title,parent_id,type,url FROM bookmarks WHERE type=?", 1);
        var image;
        var rows = [];
        while (resultSet2.isValidRow()) {
            image = 0 == resultSet2.fieldByName("type") ? "/bookmark.png" : "/folder.png";
            rows.push(Alloy.createController("bm_row", {
                parentId: resultSet2.fieldByName("parent_id"),
                title: resultSet2.fieldByName("title"),
                type: resultSet2.fieldByName("type"),
                url: resultSet2.fieldByName("url"),
                image: image
            }).getView());
            resultSet2.next();
        }
        resultSet2.close();
        db.close();
        $.tvBookmark.setData(rows);
    }
    function tvBookmark_click(e) {
        if ($.list.isView) {
            var controller = Alloy.createController("webview", {
                url: e.row.Url,
                title: e.row.Title
            });
            var win = controller.getView();
            Alloy.Globals.ActiveNav.openWindow(win, {
                animated: true
            });
        } else {
            _title = e.row.Title;
            _parentId = e.row.parentId;
            Ti.API.info("selected title:" + e.row.Title);
            Ti.API.info("selected parentId:" + e.row.parentId);
            $.list.close();
        }
    }
    function tvBookmark_delete(e) {
        if (e.row.rowId) {
            var db = Ti.Database.open("bookmarks");
            db.execute("DELETE FROM bookmarks WHERE id = ?", e.row.rowId);
            db.close();
        }
    }
    function btnRight_click() {
        if ($.list.isDel) if ($.tvBookmark.editing) {
            $.tvBookmark.editing = false;
            $.btnRight.title = "編集";
        } else {
            $.tvBookmark.editing = true;
            $.btnRight.title = "完了";
        } else $.dialog.show();
    }
    function dialog_click(e) {
        0 === e.index && (0 == e.text.length ? alert("フォルダ名を入力してください") : AddFolder(e.text));
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "list";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.list = Ti.UI.createWindow({
        tabBarHidden: "true",
        id: "list"
    });
    $.__views.list && $.addTopLevelView($.__views.list);
    $.__views.btnRight = Ti.UI.createButton({
        id: "btnRight",
        title: "新規フォルダ"
    });
    btnRight_click ? $.__views.btnRight.addEventListener("click", btnRight_click) : __defers["$.__views.btnRight!click!btnRight_click"] = true;
    $.__views.list.rightNavButton = $.__views.btnRight;
    $.__views.tvBookmark = Ti.UI.createTableView({
        id: "tvBookmark"
    });
    $.__views.list.add($.__views.tvBookmark);
    tvBookmark_click ? $.__views.tvBookmark.addEventListener("click", tvBookmark_click) : __defers["$.__views.tvBookmark!click!tvBookmark_click"] = true;
    tvBookmark_delete ? $.__views.tvBookmark.addEventListener("delete", tvBookmark_delete) : __defers["$.__views.tvBookmark!delete!tvBookmark_delete"] = true;
    var __alloyId9 = [];
    __alloyId9.push("追加");
    __alloyId9.push("キャンセル");
    $.__views.dialog = Ti.UI.createAlertDialog({
        buttonNames: __alloyId9,
        id: "dialog",
        title: "フォルダ名",
        style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
        cancel: "1"
    });
    dialog_click ? $.__views.dialog.addEventListener("click", dialog_click) : __defers["$.__views.dialog!click!dialog_click"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.list.rowId = args.rowId;
    $.list.parentId = args.parentId;
    $.list.Title = args.title;
    $.list.Url = args.url;
    $.list.type = args.type;
    $.list.isView = args.isView;
    $.list.isDel = args.isDel;
    require("alloy/moment");
    var _title = "";
    var _parentId = 0;
    $.list.isDel && ($.btnRight.title = "編集");
    GetList();
    exports.getTitle = function() {
        return _title;
    };
    exports.getParentId = function() {
        return _parentId;
    };
    __defers["$.__views.btnRight!click!btnRight_click"] && $.__views.btnRight.addEventListener("click", btnRight_click);
    __defers["$.__views.tvBookmark!click!tvBookmark_click"] && $.__views.tvBookmark.addEventListener("click", tvBookmark_click);
    __defers["$.__views.tvBookmark!delete!tvBookmark_delete"] && $.__views.tvBookmark.addEventListener("delete", tvBookmark_delete);
    __defers["$.__views.dialog!click!dialog_click"] && $.__views.dialog.addEventListener("click", dialog_click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;