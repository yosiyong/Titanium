function Controller() {
    function openFolder() {
        var controller = Alloy.createController("list");
        var win = controller.getView();
        win.addEventListener("close", function() {
            if ("" != controller.getTitle()) {
                $.lblFolder.text = controller.getTitle();
                _dirId = controller.getParentId();
                Ti.API.info("passed getTitle:" + controller.getTitle());
                Ti.API.info("passed parentId:" + controller.getParentId());
            }
        });
        Alloy.Globals.ActiveNav.openWindow(win, {
            animated: true
        });
    }
    function saveBookmark() {
        var parent_id;
        parent_id = 0 == _dirId ? 0 : _dirId;
        Ti.API.info("parent_id:" + parent_id);
        Ti.API.info("title:" + $.txtTitle.value);
        Ti.API.info("url:" + $.lblUrl.text);
        if ("" == $.txtTitle.value || "" == $.lblUrl.text) alert("タイトルを入力してください。"); else {
            var db = Ti.Database.open("bookmarks");
            db.execute("CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)");
            db.execute("INSERT INTO bookmarks (parent_id,type,title,url) VALUES (?,?,?,?)", parent_id, 0, $.txtTitle.value, $.lblUrl.text);
            db.close();
            $.winAdd.close();
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "add";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winAdd = Ti.UI.createWindow({
        id: "winAdd",
        title: "ブックマーク",
        tabBarHidden: "true"
    });
    $.__views.winAdd && $.addTopLevelView($.__views.winAdd);
    $.__views.btnSave = Ti.UI.createButton({
        id: "btnSave",
        title: "保存"
    });
    saveBookmark ? $.__views.btnSave.addEventListener("click", saveBookmark) : __defers["$.__views.btnSave!click!saveBookmark"] = true;
    $.__views.winAdd.rightNavButton = $.__views.btnSave;
    var __alloyId2 = [];
    $.__views.__alloyId3 = Ti.UI.createTableViewSection({
        headerTitle: "タイトル＆URL",
        id: "__alloyId3"
    });
    __alloyId2.push($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        height: "45dp",
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.txtTitle = Ti.UI.createTextField({
        width: "280dp",
        height: 25,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "txtTitle"
    });
    $.__views.__alloyId4.add($.__views.txtTitle);
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        height: "45dp",
        id: "__alloyId5"
    });
    $.__views.__alloyId3.add($.__views.__alloyId5);
    $.__views.lblUrl = Ti.UI.createLabel({
        width: "280dp",
        height: 25,
        color: "#000",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "lblUrl"
    });
    $.__views.__alloyId5.add($.__views.lblUrl);
    $.__views.__alloyId6 = Ti.UI.createTableViewSection({
        headerTitle: "保存フォルダ",
        id: "__alloyId6"
    });
    __alloyId2.push($.__views.__alloyId6);
    $.__views.rowFolder = Ti.UI.createTableViewRow({
        height: "45dp",
        id: "rowFolder",
        hasDetail: "true"
    });
    $.__views.__alloyId6.add($.__views.rowFolder);
    openFolder ? $.__views.rowFolder.addEventListener("click", openFolder) : __defers["$.__views.rowFolder!click!openFolder"] = true;
    $.__views.lblFolder = Ti.UI.createLabel({
        width: "220dp",
        height: 25,
        color: "#000",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "lblFolder",
        text: "フォルダ指定"
    });
    $.__views.rowFolder.add($.__views.lblFolder);
    $.__views.__alloyId1 = Ti.UI.createTableView({
        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
        data: __alloyId2,
        id: "__alloyId1"
    });
    $.__views.winAdd.add($.__views.__alloyId1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.lblUrl.text = args.url;
    $.txtTitle.value = args.value;
    var _dirId = 0;
    __defers["$.__views.btnSave!click!saveBookmark"] && $.__views.btnSave.addEventListener("click", saveBookmark);
    __defers["$.__views.rowFolder!click!openFolder"] && $.__views.rowFolder.addEventListener("click", openFolder);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;