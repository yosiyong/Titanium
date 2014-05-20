function Controller() {
    function SetIndicator(flag) {
        if (false == indicatorAdded) {
            $.winNewArticle.add(baseActInd);
            indicatorAdded = true;
        }
        if (flag) {
            Ti.API.info("---index.js SetIndicator add---:");
            baseActInd.show();
        } else {
            Ti.API.info("---index.js SetIndicator remove---:");
            baseActInd.message = null;
            baseActInd.width = Ti.UI.SIZE;
            baseActInd.hide();
        }
    }
    function SetButton() {
        $.btnTab1.backgroundImage = "/bn_newarticle_on.png";
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
    function Refresh() {
        Ti.API.info("::::btnRefresh_click::::");
        SetIndicator(true);
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
        SetIndicator(false);
    }
    function btnRefresh_click() {
        setTimeout(function() {
            Refresh();
        }, 1e3);
    }
    function btnSearch_click() {
        Ti.API.info("::::btnSearch_click::::");
        Alloy.Globals.searchBar ? Alloy.Globals.searchBar.visible = true == Alloy.Globals.searchBar.visible ? false : true : AddSearchBar();
    }
    function AddSearchBar() {
        var search = Titanium.UI.createSearchBar({
            id: "barSearch",
            barColor: "#385292",
            showCancel: false,
            visible: true,
            top: Alloy.Globals.tableTop,
            animated: true
        });
        search.height = 100;
        $.winNewArticle.add(search);
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
            win.open({
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
        win.open({
            animated: true
        });
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
    function btnTab_click(e) {
        Ti.API.info("::::btnTab1_click::::" + e.source.index);
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
            favorite.open({
                animated: true
            });
            break;

          case 3:
            var popular = Alloy.createController("popular").getView();
            popular.open({
                animated: true
            });
            break;

          case 4:
            var rsslist = Alloy.createController("rsslist").getView();
            rsslist.open({
                animated: true
            });
            break;

          default:        }
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
            Ti.API.info("index.js iconClick:" + e.index);
            Ti.API.info("index.js iconClick:" + e.id);
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
            setTimeout(function() {
                menu.initMenu(true);
            }, 1e3);
        });
        $.winNewArticle.add(menu);
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
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        fullscreen: false,
        exitOnClose: true,
        id: "winNewArticle"
    });
    $.__views.winNewArticle && $.addTopLevelView($.__views.winNewArticle);
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
    $.__views.winNewArticle.add($.__views.footer);
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
    var rss = require("rss");
    var baseActInd = Titanium.UI.createActivityIndicator({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    var ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;
    ActivityIndicatorStyle && (baseActInd.style = ActivityIndicatorStyle.BIG_DARK);
    var indicatorAdded = false;
    SetButton();
    var ad = require("net.nend");
    var adView;
    adView = ad.createView({
        spotId: 118486,
        apiKey: "190809b6d2c6a1f08ef90c2bf293ec978f1cc220",
        width: "320dp",
        height: "50dp",
        bottom: "50dp"
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
    Refresh();
    $.winNewArticle.open({
        animated: true
    });
    __defers["$.__views.btnRefresh!click!btnRefresh_click"] && $.__views.btnRefresh.addEventListener("click", btnRefresh_click);
    __defers["$.__views.btnSearch!click!btnSearch_click"] && $.__views.btnSearch.addEventListener("click", btnSearch_click);
    __defers["$.__views.tvTab1!click!tvTab1_click"] && $.__views.tvTab1.addEventListener("click", tvTab1_click);
    __defers["$.__views.btnTab1!click!btnTab_click"] && $.__views.btnTab1.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab2!click!btnTab_click"] && $.__views.btnTab2.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab3!click!btnTab_click"] && $.__views.btnTab3.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab4!click!btnTab_click"] && $.__views.btnTab4.addEventListener("click", btnTab_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;