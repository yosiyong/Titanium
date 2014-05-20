function Controller() {
    function openWindow() {
        var controller = Alloy.createController("add", {
            url: $.webView.url,
            value: $.webView.title
        });
        var win = controller.getView();
        win.open();
    }
    function btnClose_click() {
        $.winWebView.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "webview";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winWebView = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        fullscreen: false,
        id: "winWebView"
    });
    $.__views.winWebView && $.addTopLevelView($.__views.winWebView);
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
    $.__views.winWebView.add($.__views.header);
    $.__views.btnClose = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        left: "20dp",
        backgroundImage: "/back.png",
        backgroundFocusedColor: "#000",
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
    $.__views.btnBookMark = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        right: "20dp",
        backgroundImage: "/bookmark.png",
        backgroundFocusedColor: "#000",
        id: "btnBookMark"
    });
    $.__views.header.add($.__views.btnBookMark);
    openWindow ? $.__views.btnBookMark.addEventListener("click", openWindow) : __defers["$.__views.btnBookMark!click!openWindow"] = true;
    $.__views.webView = Ti.UI.createWebView({
        top: Alloy.Globals.tableTop,
        id: "webView"
    });
    $.__views.winWebView.add($.__views.webView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.webView.title = args.title;
    $.webView.url = args.url;
    $.btnBookMark.visible = args.toolbarVisible;
    Ti.API.info("--webview.js--url" + args.url);
    __defers["$.__views.btnClose!click!btnClose_click"] && $.__views.btnClose.addEventListener("click", btnClose_click);
    __defers["$.__views.btnBookMark!click!openWindow"] && $.__views.btnBookMark.addEventListener("click", openWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;