function Controller() {
    function SetButton() {
        $.btnTab3.backgroundImage = "/bn_populararticles_on.png";
        var platFormWidth = Ti.Platform.displayCaps.platformWidth;
        if (platFormWidth > 480) {
            var wid = $.btnTab1.width;
            var end = wid.indexOf("dp");
            var buttonWidth = parseInt(wid.substring(0, end));
            var wth = platFormWidth - 2 * buttonWidth;
            var asp = wth - 3 * buttonWidth;
            var sp = asp / 4;
            unitWidth = buttonWidth + sp;
            unitWidth -= platFormWidth > 900 ? 30 : 10;
            $.btnTab1.left = 0;
            $.btnTab2.left = unitWidth;
            $.btnTab3.left = 2 * unitWidth;
            $.btnTab4.left = 3 * unitWidth;
            $.btnMenu.right = 0;
        } else {
            $.footer.layout = "horizontal";
            $.btnTab1.left = 0;
            $.btnMenu.right = 0;
        }
    }
    function PoupularLoad() {
        $.wbWebView.url = "http://" + Alloy.Globals.CurrentRss.site + "/app_fav";
    }
    function btnTab_click(e) {
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
            setTimeout(function() {
                menu.initMenu(true);
            }, 1e3);
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
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        fullscreen: false,
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
        left: 0,
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
    $.__views.btnTab1 = Ti.UI.createButton({
        height: Ti.UI.FILL,
        width: "63dp",
        index: 1,
        id: "btnTab1",
        backgroundImage: "/bn_newarticle_off.png"
    });
    $.__views.footer.add($.__views.btnTab1);
    btnTab_click ? $.__views.btnTab1.addEventListener("click", btnTab_click) : __defers["$.__views.btnTab1!click!btnTab_click"] = true;
    $.__views.btnTab2 = Ti.UI.createButton({
        height: Ti.UI.FILL,
        width: "63dp",
        index: 2,
        id: "btnTab2",
        backgroundImage: "/bn_favorite_off.png"
    });
    $.__views.footer.add($.__views.btnTab2);
    btnTab_click ? $.__views.btnTab2.addEventListener("click", btnTab_click) : __defers["$.__views.btnTab2!click!btnTab_click"] = true;
    $.__views.btnTab3 = Ti.UI.createButton({
        height: Ti.UI.FILL,
        width: "63dp",
        index: 3,
        id: "btnTab3",
        backgroundImage: "/bn_populararticles_off.png"
    });
    $.__views.footer.add($.__views.btnTab3);
    btnTab_click ? $.__views.btnTab3.addEventListener("click", btnTab_click) : __defers["$.__views.btnTab3!click!btnTab_click"] = true;
    $.__views.btnTab4 = Ti.UI.createButton({
        height: Ti.UI.FILL,
        width: "63dp",
        index: 4,
        id: "btnTab4",
        backgroundImage: "/bn_rss_off.png"
    });
    $.__views.footer.add($.__views.btnTab4);
    btnTab_click ? $.__views.btnTab4.addEventListener("click", btnTab_click) : __defers["$.__views.btnTab4!click!btnTab_click"] = true;
    $.__views.btnMenu = Ti.UI.createButton({
        height: Ti.UI.FILL,
        width: "63dp",
        index: 5,
        id: "btnMenu",
        backgroundImage: "/bn_siteselection_off.png"
    });
    $.__views.footer.add($.__views.btnMenu);
    btnMenu_LongPress ? $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress) : __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    SetButton();
    var ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;
    var baseActInd = Titanium.UI.createActivityIndicator({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    ActivityIndicatorStyle && (baseActInd.style = ActivityIndicatorStyle.PLAIN);
    $.popular.add(baseActInd);
    SetMenu();
    PoupularLoad();
    $.popular.open();
    __defers["$.__views.btnTab1!click!btnTab_click"] && $.__views.btnTab1.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab2!click!btnTab_click"] && $.__views.btnTab2.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab3!click!btnTab_click"] && $.__views.btnTab3.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab4!click!btnTab_click"] && $.__views.btnTab4.addEventListener("click", btnTab_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;