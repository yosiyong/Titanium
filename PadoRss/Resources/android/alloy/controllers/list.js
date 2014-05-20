function Controller() {
    function GetList() {
        Ti.API.info("--list.js--GetList start");
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
                hasChild: false,
                image: image,
                rowId: resultSet.fieldByName("id")
            }).getView());
            resultSet.next();
        }
        resultSet.close();
        db.close();
        $.tvBookmark.setData(rows);
        Ti.API.info("--list.js--GetList end");
    }
    function AddFolder(value) {
        Ti.API.info("--list.js--AddFolder start");
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
        $.tvBookmark.setData(rows);
        while (resultSet2.isValidRow()) {
            image = 0 == resultSet2.fieldByName("type") ? "/bookmark.png" : "/folder.png";
            rows.push(Alloy.createController("bm_row", {
                parentId: resultSet2.fieldByName("parent_id"),
                title: resultSet2.fieldByName("title"),
                type: resultSet2.fieldByName("type"),
                url: resultSet2.fieldByName("url"),
                hasChild: false,
                image: image
            }).getView());
            resultSet2.next();
        }
        resultSet2.close();
        db.close();
        $.tvBookmark.setData(rows);
        Ti.API.info("--list.js--AddFolder end");
    }
    function tvBookmark_click(e) {
        if ($.list.isView) {
            Ti.API.info("--list.js--tvBookmark_click webview open Title:" + e.row.Title);
            var toolbarVisible = true;
            $.list.isDel && (toolbarVisible = false);
            var controller = Alloy.createController("webview", {
                url: e.row.Url,
                title: e.row.Title,
                toolbarVisible: toolbarVisible
            });
            var win = controller.getView();
            win.open({
                animated: true
            });
        } else {
            Ti.API.info("--list.js--tvBookmark_click list open Title:" + e.row.Title + ":parent_id:" + e.row.parentId);
            _title = e.row.Title;
            _parentId = e.row.parentId;
            $.list.close();
        }
    }
    function tvBookmark_delete(e) {
        if (e.row.rowId) {
            Ti.API.info("--list.js--tvBookmark_delete :" + e.row.rowId);
            var db = Ti.Database.open("bookmarks");
            db.execute("DELETE FROM bookmarks WHERE id = ?", e.row.rowId);
            db.close();
        }
    }
    function btnRight_click() {
        $.list.isDel ? $.tvBookmark.editing = $.tvBookmark.editing ? false : true : SetDialog();
    }
    function doneConfirm() {
        $.list.close({
            animated: true
        });
    }
    function btnClose_click() {
        doneConfirm();
    }
    function SetDialog() {
        var view = Ti.UI.createView({
            layout: "vertical",
            backgroundColor: "#467cb3"
        });
        var txtFolder = Ti.UI.createTextField({
            hintText: "フォルダ名を入力してください",
            width: Ti.UI.FILL
        });
        view.add(txtFolder);
        var dialog = Ti.UI.createOptionDialog({
            androidView: view,
            buttonNames: [ "キャンセル", "保存" ]
        });
        dialog.addEventListener("click", function(e) {
            1 == e.index && (0 == txtFolder.value.length ? alert("フォルダ名を入力してください") : AddFolder(txtFolder.value));
        });
        dialog.show();
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
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        id: "list"
    });
    $.__views.list && $.addTopLevelView($.__views.list);
    $.__views.header = Ti.UI.createView({
        top: Alloy.Globals.top,
        height: "45dp",
        width: Ti.UI.FILL,
        textAlign: "center",
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#c1cedf",
                offset: "0.0"
            }, {
                color: "#597498",
                offset: "1.0"
            } ]
        },
        color: "#fff",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "header"
    });
    $.__views.list.add($.__views.header);
    $.__views.btnClose = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        left: 20,
        backgroundImage: "/back.png",
        id: "btnClose"
    });
    $.__views.header.add($.__views.btnClose);
    btnClose_click ? $.__views.btnClose.addEventListener("click", btnClose_click) : __defers["$.__views.btnClose!click!btnClose_click"] = true;
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        id: "title"
    });
    $.__views.header.add($.__views.title);
    $.__views.btnRight = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: "40dp",
        backgroundColor: "#52739e",
        color: "#fff",
        right: 20,
        id: "btnRight",
        title: "新規フォルダ"
    });
    $.__views.header.add($.__views.btnRight);
    btnRight_click ? $.__views.btnRight.addEventListener("click", btnRight_click) : __defers["$.__views.btnRight!click!btnRight_click"] = true;
    $.__views.tvBookmark = Ti.UI.createTableView({
        top: Alloy.Globals.tableTop,
        id: "tvBookmark"
    });
    $.__views.list.add($.__views.tvBookmark);
    tvBookmark_click ? $.__views.tvBookmark.addEventListener("click", tvBookmark_click) : __defers["$.__views.tvBookmark!click!tvBookmark_click"] = true;
    tvBookmark_delete ? $.__views.tvBookmark.addEventListener("delete", tvBookmark_delete) : __defers["$.__views.tvBookmark!delete!tvBookmark_delete"] = true;
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
    var _title = "";
    var _parentId = 0;
    $.list.isDel && ($.btnRight.visible = false);
    GetList();
    CallBackDelRow = function() {
        Ti.API.info("--list.js--foo start");
        GetList();
        Ti.API.info("--list.js--foo end");
    };
    Ti.App.addEventListener("foo", CallBackDelRow);
    $.list.addEventListener("close", function() {
        Ti.API.info("--list.js--close start");
        Titanium.App.removeEventListener("foo", CallBackDelRow);
        Ti.API.info("--list.js--close end");
    });
    exports.getTitle = function() {
        return _title;
    };
    exports.getParentId = function() {
        return _parentId;
    };
    $.list.open({
        animated: true
    });
    __defers["$.__views.btnClose!click!btnClose_click"] && $.__views.btnClose.addEventListener("click", btnClose_click);
    __defers["$.__views.btnRight!click!btnRight_click"] && $.__views.btnRight.addEventListener("click", btnRight_click);
    __defers["$.__views.tvBookmark!click!tvBookmark_click"] && $.__views.tvBookmark.addEventListener("click", tvBookmark_click);
    __defers["$.__views.tvBookmark!delete!tvBookmark_delete"] && $.__views.tvBookmark.addEventListener("delete", tvBookmark_delete);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;