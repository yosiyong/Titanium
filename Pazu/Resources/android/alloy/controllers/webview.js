function Controller() {
    function openWindow() {
        var controller = Alloy.createController("add", {
            url: $.webView.url,
            value: $.webView.title
        });
        var win = controller.getView();
        Alloy.Globals.ActiveNav.openWindow(win, {
            animated: true
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "webview";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.webview = Ti.UI.createWindow({
        tabBarHidden: "true",
        id: "webview"
    });
    $.__views.webview && $.addTopLevelView($.__views.webview);
    $.__views.btnBookmark = Ti.UI.createButton({
        id: "btnBookmark",
        systemButton: Ti.UI.iPhone.SystemButton.BOOKMARKS
    });
    openWindow ? $.__views.btnBookmark.addEventListener("click", openWindow) : __defers["$.__views.btnBookmark!click!openWindow"] = true;
    $.__views.webview.rightNavButton = $.__views.btnBookmark;
    $.__views.webView = Ti.UI.createWebView({
        id: "webView"
    });
    $.__views.webview.add($.__views.webView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.webView.title = args.title;
    $.webView.url = args.url;
    __defers["$.__views.btnBookmark!click!openWindow"] && $.__views.btnBookmark.addEventListener("click", openWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;