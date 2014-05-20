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
        win.open({
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
            $.winAdd.close({
                animated: true
            });
        }
    }
    function btnClose_click() {
        $.winAdd.close({
            animated: true
        });
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
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        fullscreen: false,
        id: "winAdd",
        title: "ブックマーク"
    });
    $.__views.winAdd && $.addTopLevelView($.__views.winAdd);
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
    $.__views.winAdd.add($.__views.header);
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
    $.__views.btnSave = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: "40dp",
        backgroundColor: "#52739e",
        color: "#fff",
        right: 20,
        id: "btnSave",
        title: "保存"
    });
    $.__views.header.add($.__views.btnSave);
    saveBookmark ? $.__views.btnSave.addEventListener("click", saveBookmark) : __defers["$.__views.btnSave!click!saveBookmark"] = true;
    var __alloyId0 = [];
    $.__views.__alloyId3 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "30dp",
        color: "#fff",
        backgroundColor: "#000003",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        text: "タイトル",
        id: "__alloyId3"
    });
    $.__views.__alloyId1 = Ti.UI.createTableViewSection({
        headerView: $.__views.__alloyId3,
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        height: "45dp",
        id: "__alloyId4"
    });
    $.__views.__alloyId1.add($.__views.__alloyId4);
    $.__views.txtTitle = Ti.UI.createTextField({
        width: "280dp",
        height: "50dp",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "txtTitle"
    });
    $.__views.__alloyId4.add($.__views.txtTitle);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "30dp",
        color: "#fff",
        backgroundColor: "#000003",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        text: "URL",
        id: "__alloyId7"
    });
    $.__views.__alloyId5 = Ti.UI.createTableViewSection({
        headerView: $.__views.__alloyId7,
        id: "__alloyId5"
    });
    __alloyId0.push($.__views.__alloyId5);
    $.__views.__alloyId8 = Ti.UI.createTableViewRow({
        height: "45dp",
        id: "__alloyId8"
    });
    $.__views.__alloyId5.add($.__views.__alloyId8);
    $.__views.lblUrl = Ti.UI.createLabel({
        width: "280dp",
        height: "25dp",
        color: "#000",
        font: {
            fontSize: "20dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "lblUrl"
    });
    $.__views.__alloyId8.add($.__views.lblUrl);
    $.__views.__alloyId11 = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "30dp",
        color: "#fff",
        backgroundColor: "#000003",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        text: "保存フォルダ",
        id: "__alloyId11"
    });
    $.__views.__alloyId9 = Ti.UI.createTableViewSection({
        headerView: $.__views.__alloyId11,
        id: "__alloyId9"
    });
    __alloyId0.push($.__views.__alloyId9);
    $.__views.rowFolder = Ti.UI.createTableViewRow({
        height: "45dp",
        id: "rowFolder",
        hasChild: "true"
    });
    $.__views.__alloyId9.add($.__views.rowFolder);
    openFolder ? $.__views.rowFolder.addEventListener("click", openFolder) : __defers["$.__views.rowFolder!click!openFolder"] = true;
    $.__views.lblFolder = Ti.UI.createLabel({
        width: "220dp",
        height: "25dp",
        color: "#000",
        font: {
            fontSize: "20dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        id: "lblFolder",
        text: "フォルダ指定"
    });
    $.__views.rowFolder.add($.__views.lblFolder);
    $.__views.tvAdd = Ti.UI.createTableView({
        top: Alloy.Globals.tableTop,
        data: __alloyId0,
        id: "tvAdd"
    });
    $.__views.winAdd.add($.__views.tvAdd);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.lblUrl.text = args.url;
    $.txtTitle.value = args.value;
    var _dirId = 0;
    __defers["$.__views.btnClose!click!btnClose_click"] && $.__views.btnClose.addEventListener("click", btnClose_click);
    __defers["$.__views.btnSave!click!saveBookmark"] && $.__views.btnSave.addEventListener("click", saveBookmark);
    __defers["$.__views.rowFolder!click!openFolder"] && $.__views.rowFolder.addEventListener("click", openFolder);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;