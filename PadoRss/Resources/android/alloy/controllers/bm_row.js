function Controller() {
    function deleteTask(e) {
        Ti.API.info("--bm_row.js--deleteTask start");
        e.cancelBubble = true;
        var db = Ti.Database.open("bookmarks");
        1 == $.bm_row.type ? db.execute("DELETE FROM bookmarks WHERE parent_id = ?", $.bm_row.parentId) : db.execute("DELETE FROM bookmarks WHERE id = ?", $.bm_row.rowId);
        db.close();
        Ti.App.fireEvent("foo");
        Ti.API.info("--bm_row.js--deleteTask end");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "bm_row";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.bm_row = Ti.UI.createTableViewRow({
        backgroundColor: "#fff",
        height: "50dp",
        focusable: false,
        id: "bm_row"
    });
    $.__views.bm_row && $.addTopLevelView($.__views.bm_row);
    $.__views.image = Ti.UI.createImageView({
        height: "30dp",
        width: "30dp",
        left: "5dp",
        touchEnabled: false,
        id: "image"
    });
    $.__views.bm_row.add($.__views.image);
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: "50dp",
        color: "#000",
        font: {
            fontSize: "16dp"
        },
        left: "50dp",
        right: "50dp",
        touchEnabled: false,
        id: "title"
    });
    $.__views.bm_row.add($.__views.title);
    $.__views.remove = Ti.UI.createImageView({
        image: "/red_x.png",
        right: 0,
        height: "50dp",
        width: "50dp",
        id: "remove"
    });
    $.__views.bm_row.add($.__views.remove);
    deleteTask ? $.__views.remove.addEventListener("click", deleteTask) : __defers["$.__views.remove!click!deleteTask"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.bm_row.parentId = args.parentId;
    $.bm_row.Title = args.title;
    $.bm_row.Url = args.url;
    $.bm_row.type = args.type;
    $.image.image = args.image;
    $.title.text = args.title;
    $.bm_row.hasChild = args.hasChild;
    $.bm_row.rowId = args.rowId;
    __defers["$.__views.remove!click!deleteTask"] && $.__views.remove.addEventListener("click", deleteTask);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;