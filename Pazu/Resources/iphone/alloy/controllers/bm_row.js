function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "bm_row";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.bm_row = Ti.UI.createTableViewRow({
        backgroundColor: "#fff",
        height: "50dp",
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
        touchEnabled: false,
        id: "title"
    });
    $.__views.bm_row.add($.__views.title);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.bm_row.parentId = args.parentId;
    $.bm_row.Title = args.title;
    $.bm_row.Url = args.url;
    $.bm_row.type = args.type;
    $.image.image = args.image;
    $.title.text = args.title;
    $.bm_row.rowId = args.rowId;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;