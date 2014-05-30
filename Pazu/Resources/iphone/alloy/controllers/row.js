function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "row";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        backgroundColor: "#fff",
        height: "70dp",
        className: "datarow",
        hasChild: true,
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.image = Ti.UI.createImageView({
        id: "image"
    });
    $.__views.row.add($.__views.image);
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: "43dp",
        color: "#000",
        font: {
            fontSize: "16dp"
        },
        top: "5dp",
        left: "5dp",
        touchEnabled: false,
        id: "title"
    });
    $.__views.row.add($.__views.title);
    $.__views.date = Ti.UI.createLabel({
        width: "100dp",
        height: Ti.UI.SIZE,
        color: "#444",
        right: "3dp",
        bottom: "3dp",
        font: {
            fontSize: "12dp"
        },
        textAlign: "center",
        touchEnabled: false,
        id: "date"
    });
    $.__views.row.add($.__views.date);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.row.articleUrl = args.articleUrl;
    $.row.articleTitle = args.title;
    $.image.image = args.image;
    $.date.text = args.date;
    $.title.text = args.title;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;