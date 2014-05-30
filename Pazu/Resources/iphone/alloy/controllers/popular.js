function Controller() {
    function isiOS7Plus() {
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0], 10);
        if (major >= 7) return true;
        return false;
    }
    function PoupularLoad() {
        $.wbWebView.url = "http://" + Alloy.Globals.CurrentRss.site + "/app_fav";
    }
    function tabbedbar_click(e) {
        Ti.API.info("::::INDEX::::" + e.source.index);
        switch (e.source.index) {
          case 1:
            var index = Alloy.createController("index").getView();
            index.open();
            break;

          case 2:
            var favorite = Alloy.createController("favorite").getView();
            favorite.open();
            break;

          case 3:
            $.btnTab1.backgroundImage = "/bn_newarticle_on.png";
            $.btnTab2.backgroundImage = "/bn_favorite_off.png";
            $.btnTab3.backgroundImage = "/bn_populararticles_onf.png";
            $.btnTab4.backgroundImage = "/bn_rss_off.png";
            $.btnMenu.backgroundImage = "/bn_siteselection_off.png";
            break;

          case 4:
            var rsslist = Alloy.createController("rsslist").getView();
            rsslist.open();
            break;

          default:        }
    }
    function btnMenu_LongPress() {
        Ti.API.info("::::btnMenu_LongPress::::");
        $.btnTab1.backgroundImage = "/bn_newarticle_off.png";
        $.btnTab2.backgroundImage = "/bn_favorite_off.png";
        $.btnTab3.backgroundImage = "/bn_populararticles_off.png";
        $.btnTab4.backgroundImage = "/bn_rss_off.png";
        $.btnMenu.backgroundImage = "/bn_siteselection_on.png";
        Ti.App.fireEvent("MenuButtonClick");
    }
    function SetMenu() {
        var menu = require("/path").createMenu({
            iconList: [ {
                image: "/rss1.png",
                id: "rss1"
            }, {
                image: "/rss2.png",
                id: "rss2"
            }, {
                image: "/rss3.png",
                id: "rss3"
            }, {
                image: "/rss4.png",
                id: "rss4"
            }, {
                image: "/clear.png",
                id: "rss5"
            } ]
        });
        menu.opacity = 0;
        menu.addEventListener("iconClick", function(e) {
            Ti.API.info(e.source);
            Ti.API.info(e.index);
            Ti.API.info(e.id);
            var title, site, url;
            switch (e.index) {
              case 0:
                title = Alloy.Globals.Rss.rss1.title;
                site = Alloy.Globals.Rss.rss1.site;
                url = "http://" + Alloy.Globals.Rss.rss1.site + "/feed";
                break;

              case 1:
                title = Alloy.Globals.Rss.rss2.title;
                site = Alloy.Globals.Rss.rss2.site;
                url = "http://" + Alloy.Globals.Rss.rss2.site + "/feed";
                break;

              case 2:
                title = Alloy.Globals.Rss.rss3.title;
                site = Alloy.Globals.Rss.rss3.site;
                url = "http://" + Alloy.Globals.Rss.rss3.site + "/feed";
                break;

              case 3:
                title = Alloy.Globals.Rss.rss4.title;
                site = Alloy.Globals.Rss.rss4.site;
                url = "http://" + Alloy.Globals.Rss.rss4.site + "/feed";
                break;

              case 4:
                title = Alloy.Globals.Rss.rss5.title;
                site = Alloy.Globals.Rss.rss5.site;
                url = "http://" + Alloy.Globals.Rss.rss5.site + "/feed";
            }
            Alloy.Globals.CurrentRss = {
                title: title,
                site: site,
                url: url
            };
            tab3Click();
        });
        $.popular.add(menu);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "popular";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.popular = Ti.UI.createWindow({
        fullscreen: false,
        navBarHidden: true,
        exitOnClose: true,
        id: "popular"
    });
    $.__views.popular && $.addTopLevelView($.__views.popular);
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
    $.__views.popular.add($.__views.header);
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        text: "人気記事",
        id: "title"
    });
    $.__views.header.add($.__views.title);
    $.__views.wbWebView = Ti.UI.createWebView({
        top: Alloy.Globals.tableTop,
        bottom: "46dp",
        id: "wbWebView"
    });
    $.__views.popular.add($.__views.wbWebView);
    $.__views.footer = Ti.UI.createView({
        bottom: 0,
        height: "50dp",
        width: Ti.UI.FILL,
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
                color: "#000003",
                offset: 0
            }, {
                color: "#000003",
                offset: 1
            } ]
        },
        id: "footer"
    });
    $.__views.popular.add($.__views.footer);
    $.__views.tabbedbar = Ti.UI.createButtonBar({
        style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
        index: 0,
        height: 50,
        left: 0,
        id: "tabbedbar"
    });
    $.__views.footer.add($.__views.tabbedbar);
    tabbedbar_click ? $.__views.tabbedbar.addEventListener("click", tabbedbar_click) : __defers["$.__views.tabbedbar!click!tabbedbar_click"] = true;
    $.__views.btnTab1 = Ti.UI.createButton({
        index: 1,
        height: 49,
        width: 63,
        id: "btnTab1",
        backgroundImage: "/bn_newarticle_off.png"
    });
    $.__views.tabbedbar.add($.__views.btnTab1);
    $.__views.btnTab2 = Ti.UI.createButton({
        index: 2,
        height: 49,
        width: 63,
        id: "btnTab2",
        backgroundImage: "/bn_favorite_off.png"
    });
    $.__views.tabbedbar.add($.__views.btnTab2);
    $.__views.btnTab3 = Ti.UI.createButton({
        index: 3,
        height: 49,
        width: 63,
        id: "btnTab3",
        backgroundImage: "/bn_populararticles_off.png"
    });
    $.__views.tabbedbar.add($.__views.btnTab3);
    $.__views.btnTab4 = Ti.UI.createButton({
        index: 4,
        height: 49,
        width: 63,
        id: "btnTab4",
        backgroundImage: "/bn_rss_off.png"
    });
    $.__views.tabbedbar.add($.__views.btnTab4);
    $.__views.btnMenu = Ti.UI.createButton({
        index: 5,
        height: 50,
        width: 63,
        id: "btnMenu",
        backgroundImage: "/bn_siteselection_off.png"
    });
    $.__views.tabbedbar.add($.__views.btnMenu);
    btnMenu_LongPress ? $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress) : __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var platFormWidth = Ti.Platform.displayCaps.platformWidth;
    var unitWidth = platFormWidth / 5;
    $.btnTab1.left = "0dp";
    $.btnTab2.left = unitWidth + "dp";
    $.btnTab3.left = 2 * unitWidth + "dp";
    $.btnTab3.backgroundImage = "/bn_populararticles_on.png";
    $.btnTab4.left = 3 * unitWidth + "dp";
    $.btnMenu.left = 4 * unitWidth + "dp";
    var isIOS7 = isiOS7Plus();
    true && Alloy.isTablet;
    var osname = Ti.Platform.osname;
    var isIos = "iphone" === osname || "ipad" === osname;
    var ActivityIndicatorStyle;
    isIos ? ActivityIndicatorStyle = Titanium.UI.iPhone.ActivityIndicatorStyle : sdkVersion >= 3 && (ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle);
    var baseActInd = Titanium.UI.createActivityIndicator({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    ActivityIndicatorStyle && (baseActInd.style = isIOS7 ? ActivityIndicatorStyle.DARK : ActivityIndicatorStyle.PLAIN);
    $.popular.add(baseActInd);
    SetMenu();
    PoupularLoad();
    $.popular.open();
    __defers["$.__views.tabbedbar!click!tabbedbar_click"] && $.__views.tabbedbar.addEventListener("click", tabbedbar_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;