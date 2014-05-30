function Controller() {
    function isiOS7Plus() {
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0], 10);
        if (major >= 7) return true;
        return false;
    }
    function Refresh() {
        Ti.API.info("::::btnRefresh_click::::");
        if (false === Titanium.Network.online) {
            var dialog = Ti.UI.createAlertDialog({
                title: "ネットワーク接続できていません"
            });
            dialog.show();
            return;
        }
        Alloy.Globals.CurrentRss.url = "http://" + Alloy.Globals.CurrentRss.site + "/feed";
        rss.loadRssFeed({
            success: function(data) {
                var rows = [];
                _.each(data, function(item) {
                    rows.push(Alloy.createController("row", {
                        articleUrl: item.link,
                        title: item.title,
                        date: item.pubDate
                    }).getView());
                });
                $.tvTab1.setData(rows);
            }
        });
    }
    function btnRefresh_click() {
        Refresh();
    }
    function btnSearch_click() {
        Ti.API.info("::::btnSearch_click::::");
        if (Alloy.Globals.searchBar) if (true == Alloy.Globals.searchBar.visible) Alloy.Globals.searchBar.visible = false; else {
            Alloy.Globals.searchBar.visible = true;
            Alloy.Globals.searchBar.show({
                animated: true
            });
        } else AddSearchBar();
    }
    function AddSearchBar() {
        var search = Titanium.UI.createSearchBar({
            id: "barSearch",
            showCancel: true,
            visible: true,
            top: 0,
            animated: true
        });
        $.tvTab1.add(search);
        Alloy.Globals.searchBar = search;
        search.addEventListener("change", function() {});
        search.addEventListener("cancel", function(e) {
            e.source.hide();
            search.blur();
        });
        search.addEventListener("return", function(e) {
            search.blur();
            e.source.hide();
            var controller = Alloy.createController("webview", {
                url: "http://" + Alloy.Globals.CurrentRss.site + "/?s=" + search.value,
                toolbarVisible: true
            });
            var win = controller.getView();
            $.winNav.openWindow(win, {
                animated: true
            });
        });
        search.addEventListener("focus", function() {
            Ti.API.info("search bar: focus received");
        });
        search.addEventListener("blur", function() {
            Titanium.API.info("search bar:blur received");
        });
    }
    function tvTab1_click(e) {
        var controller = Alloy.createController("webview", {
            url: e.row.articleUrl,
            title: e.row.articleTitle,
            toolbarVisible: true
        });
        var win = controller.getView();
        $.winNav.openWindow(win, {
            animated: true
        });
        Alloy.Globals.ActiveNav = $.winNav;
    }
    function tabbedbar_click(e) {
        Ti.API.info("::::INDEX::::" + e.source.index);
        switch (e.source.index) {
          case 1:
            $.btnTab1.backgroundImage = "/bn_newarticle_on.png";
            $.btnTab2.backgroundImage = "/bn_favorite_off.png";
            $.btnTab3.backgroundImage = "/bn_populararticles_off.png";
            $.btnTab4.backgroundImage = "/bn_rss_off.png";
            $.btnMenu.backgroundImage = "/bn_siteselection_off.png";
            break;

          case 2:
            var favorite = Alloy.createController("favorite").getView();
            favorite.open();
            break;

          case 3:
            var popular = Alloy.createController("popular").getView();
            popular.open();
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
            Refresh();
        });
        $.winNav.add(menu);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winNewArticle = Ti.UI.createWindow({
        fullscreen: false,
        navBarHidden: true,
        exitOnClose: true,
        id: "winNewArticle"
    });
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
    $.__views.winNewArticle.add($.__views.header);
    $.__views.btnRefresh = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        left: 10,
        style: Ti.UI.iPhone.SystemButtonStyle.BORDERED,
        backgroundImage: "/refresh.png",
        id: "btnRefresh"
    });
    $.__views.header.add($.__views.btnRefresh);
    btnRefresh_click ? $.__views.btnRefresh.addEventListener("click", btnRefresh_click) : __defers["$.__views.btnRefresh!click!btnRefresh_click"] = true;
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        text: "新規記事",
        id: "title"
    });
    $.__views.header.add($.__views.title);
    $.__views.btnSearch = Ti.UI.createButton({
        width: "30dp",
        height: "30dp",
        right: 10,
        style: Ti.UI.iPhone.SystemButtonStyle.BORDERED,
        backgroundImage: "/search.png",
        id: "btnSearch"
    });
    $.__views.header.add($.__views.btnSearch);
    btnSearch_click ? $.__views.btnSearch.addEventListener("click", btnSearch_click) : __defers["$.__views.btnSearch!click!btnSearch_click"] = true;
    $.__views.tvTab1 = Ti.UI.createTableView({
        top: Alloy.Globals.tableTop,
        bottom: "46dp",
        id: "tvTab1"
    });
    $.__views.winNewArticle.add($.__views.tvTab1);
    tvTab1_click ? $.__views.tvTab1.addEventListener("click", tvTab1_click) : __defers["$.__views.tvTab1!click!tvTab1_click"] = true;
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
    $.__views.winNewArticle.add($.__views.footer);
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
    $.__views.winNav = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.winNewArticle,
        id: "winNav"
    });
    $.__views.winNav && $.addTopLevelView($.__views.winNav);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var platFormWidth = Ti.Platform.displayCaps.platformWidth;
    var unitWidth = platFormWidth / 5;
    $.btnTab1.left = "0dp";
    $.btnTab1.backgroundImage = "/bn_newarticle_on.png";
    $.btnTab2.left = unitWidth + "dp";
    $.btnTab3.left = 2 * unitWidth + "dp";
    $.btnTab4.left = 3 * unitWidth + "dp";
    $.btnMenu.left = 4 * unitWidth + "dp";
    isiOS7Plus();
    true && Alloy.isTablet;
    Ti.Platform.osname;
    var ad = require("net.nend");
    var adView;
    adView = "android" === Ti.Platform.osname ? ad.createView({
        spotId: 118486,
        apiKey: "190809b6d2c6a1f08ef90c2bf293ec978f1cc220",
        width: 320,
        height: 50,
        bottom: 50
    }) : ad.createView({
        spotId: 118486,
        apiKey: "190809b6d2c6a1f08ef90c2bf293ec978f1cc220",
        width: 320,
        height: 50,
        bottom: 50
    });
    adView.addEventListener("receive", function() {
        Ti.API.info("net.nend　receive");
    });
    adView.addEventListener("error", function() {
        Ti.API.info("net.nend　error");
    });
    adView.addEventListener("click", function() {
        Ti.API.info("net.nend　click");
    });
    $.winNewArticle.add(adView);
    SetMenu();
    var rss = require("rss");
    Refresh();
    $.winNav.open();
    Alloy.Globals.ActiveNav = $.winNav;
    __defers["$.__views.btnRefresh!click!btnRefresh_click"] && $.__views.btnRefresh.addEventListener("click", btnRefresh_click);
    __defers["$.__views.btnSearch!click!btnSearch_click"] && $.__views.btnSearch.addEventListener("click", btnSearch_click);
    __defers["$.__views.tvTab1!click!tvTab1_click"] && $.__views.tvTab1.addEventListener("click", tvTab1_click);
    __defers["$.__views.tabbedbar!click!tabbedbar_click"] && $.__views.tabbedbar.addEventListener("click", tabbedbar_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;