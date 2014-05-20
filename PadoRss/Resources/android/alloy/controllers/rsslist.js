function Controller() {
    function SetButton() {
        Ti.API.info("--SetButton start---");
        $.btnTab4.backgroundImage = "/bn_rss_on.png";
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
    function RssListLoad() {
        Ti.API.info("--RssListLoad start---:" + Alloy.Globals.EnableRss);
        if (true === Alloy.Globals.EnableRss) {
            lastDistance = 0;
            lastRow = 20;
            updating = false;
            Refresh();
        }
        Ti.API.info("--RssListLoad end---");
    }
    function beginUpdate() {
        Ti.API.info("--beginUpdate start---");
        updating = true;
        SetIndicator(true);
        $.tvRssList.appendRow(loadingRow);
        Ti.API.info("ADD LOAD ROW:" + lastRow);
        setTimeout(endUpdate, 2e3);
        Ti.API.info("--beginUpdate end---");
    }
    function endUpdate() {
        Ti.API.info("--endUpdate start---");
        updating = false;
        $.tvRssList.deleteRow(lastRow);
        Ti.API.info("DELETE ROW:" + lastRow);
        var db = Ti.Database.open("tRss");
        db.execute("CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)");
        var resultSet = db.execute("SELECT id,title,url,pubDate FROM tRss ORDER BY pubDate DESC LIMIT 20 OFFSET ?", lastRow);
        while (resultSet.isValidRow()) {
            $.tvRssList.appendRow(Alloy.createController("row", {
                articleUrl: resultSet.fieldByName("url"),
                title: resultSet.fieldByName("title"),
                date: resultSet.fieldByName("pubDate")
            }).getView(), {
                animationStyle: Titanium.UI.iPhone.RowAnimationStyle.NONE
            });
            Ti.API.info("ADDROW:" + lastRow);
            lastRow += 1;
            resultSet.next();
        }
        resultSet.close();
        db.close();
        SetIndicator(false);
        Ti.API.info("--endUpdate end---");
    }
    function SetRssList() {
        Ti.API.info("---SetRssList start---:");
        var db = Ti.Database.open("tRss");
        db.execute("CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)");
        var resultSet = db.execute("SELECT id,title,url,pubDate FROM tRss ORDER BY pubDate DESC LIMIT 20");
        var rows = [];
        while (resultSet.isValidRow()) {
            rows.push(Alloy.createController("row", {
                articleUrl: resultSet.fieldByName("url"),
                title: resultSet.fieldByName("title"),
                date: resultSet.fieldByName("pubDate")
            }).getView());
            resultSet.next();
        }
        resultSet.close();
        db.close();
        $.tvRssList.setData(rows);
        Ti.API.info("---SetRssList end---:");
    }
    function SetIndicator(flag) {
        if (flag) {
            Ti.API.info("---SetIndicator add---:");
            if (false == indicatorAdded) {
                $.winRssList.add(baseActInd);
                indicatorAdded = true;
            }
            baseActInd.show();
        } else {
            Ti.API.info("---SetIndicator remove---:");
            baseActInd.message = null;
            baseActInd.width = Ti.UI.SIZE;
            baseActInd.hide();
        }
    }
    function Refresh() {
        Ti.API.info("---Refresh---:");
        if (false == Titanium.Network.online) {
            var dialog = Ti.UI.createAlertDialog({
                title: "ネットワーク接続できていません"
            });
            dialog.show();
            return;
        }
        SetIndicator(true);
        $.btnRefresh.enabled = false;
        Titanium.App.removeEventListener("EndLinks", CallEndLinks);
        var db = Ti.Database.open("tRss");
        db.execute("CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)");
        db.execute("DELETE FROM tRss");
        db.execute("DELETE FROM sqlite_sequence WHERE name=?", "tRss");
        db.close();
        Titanium.App.addEventListener("EndLinks", CallEndLinks);
        Alloy.Globals.CurrentRss.url = "http://bbspzdr.pad-plus.com/app_" + Alloy.Globals.CurrentRss.site + ".xml";
        rss.setUrl(Alloy.Globals.CurrentRss.url);
        rss.loadRssFeedDb({
            success: function() {},
            error: function() {
                Ti.API.info("★★ERROR★★:[" + url + "]");
            }
        });
    }
    function btnRefresh_click() {
        Ti.API.info("---btnRefresh_click---:");
        $.tvRssList.setData([]);
        setTimeout(function() {
            Refresh();
        }, 1e3);
    }
    function tvRssList_click(e) {
        Ti.API.info("---tvRssList_click---:");
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
            var popular = Alloy.createController("popular").getView();
            popular.open();
            break;

          case 4:
            $.btnTab1.backgroundImage = "/bn_newarticle_off.png";
            $.btnTab2.backgroundImage = "/bn_favorite_off.png";
            $.btnTab3.backgroundImage = "/bn_populararticles_off.png";
            $.btnTab4.backgroundImage = "/bn_rss_on.png";
            $.btnMenu.backgroundImage = "/bn_siteselection_off.png";
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
                url = "http://bbspzdr.pad-plus.com/app_" + Alloy.Globals.Rss.rss1.site + ".xml";
                break;

              case 1:
                title = Alloy.Globals.Rss.rss2.title;
                site = Alloy.Globals.Rss.rss2.site;
                url = "http://bbspzdr.pad-plus.com/app_" + Alloy.Globals.Rss.rss2.site + ".xml";
                break;

              case 2:
                title = Alloy.Globals.Rss.rss3.title;
                site = Alloy.Globals.Rss.rss3.site;
                url = "http://bbspzdr.pad-plus.com/app_" + Alloy.Globals.Rss.rss3.site + ".xml";
                break;

              case 3:
                title = Alloy.Globals.Rss.rss4.title;
                site = Alloy.Globals.Rss.rss4.site;
                url = "http://bbspzdr.pad-plus.com/app_" + Alloy.Globals.Rss.rss4.site + ".xml";
                break;

              case 4:
                title = Alloy.Globals.Rss.rss5.title;
                site = Alloy.Globals.Rss.rss5.site;
                url = "http://bbspzdr.pad-plus.com/app_" + Alloy.Globals.Rss.rss5.site + ".xml";
            }
            Alloy.Globals.CurrentRss = {
                title: title,
                site: site,
                url: url
            };
            var rows = [];
            $.tvRssList.setData(rows);
            Refresh();
            setTimeout(function() {
                menu.initMenu(true);
            }, 1e3);
        });
        $.winRssList.add(menu);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "rsslist";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winRssList = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        fullscreen: false,
        exitOnClose: true,
        id: "winRssList"
    });
    $.__views.winRssList && $.addTopLevelView($.__views.winRssList);
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
    $.__views.winRssList.add($.__views.header);
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
        text: "RSS",
        id: "title"
    });
    $.__views.header.add($.__views.title);
    $.__views.tvRssList = Ti.UI.createTableView({
        top: Alloy.Globals.tableTop,
        bottom: "46dp",
        id: "tvRssList"
    });
    $.__views.winRssList.add($.__views.tvRssList);
    tvRssList_click ? $.__views.tvRssList.addEventListener("click", tvRssList_click) : __defers["$.__views.tvRssList!click!tvRssList_click"] = true;
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
    $.__views.winRssList.add($.__views.footer);
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
    $.winRssList.add(adView);
    var baseActInd = Titanium.UI.createActivityIndicator({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    var ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;
    ActivityIndicatorStyle && (baseActInd.style = ActivityIndicatorStyle.BIG_DARK);
    var indicatorAdded = false;
    SetMenu();
    var rss = require("rss");
    var lastDistance = 0;
    var lastRow = 20;
    var updating = false;
    var loadingRow = Ti.UI.createTableViewRow();
    CallEndLinks = function(e) {
        Ti.API.info("--CallendLinks start---");
        Ti.API.info("★EndLinks:[" + e.param1 + "](" + e.param2 + ")");
        Ti.API.info("CallEndLinks:画面表示処理");
        Titanium.App.removeEventListener("EndLinks", CallEndLinks);
        SetRssList();
        Alloy.Globals.EnableRss = false;
        $.btnRefresh.enabled = true;
        SetIndicator(false);
        Ti.API.info("--CallendLinks end---");
    };
    RssListLoad();
    $.winRssList.addEventListener("blur", function() {
        Ti.API.info("--winRssList blur start--");
        Alloy.Globals.EnableRss = true;
        Titanium.App.removeEventListener("EndLinks", CallEndLinks);
        Ti.API.info("--winRssList blur end--");
    });
    $.tvRssList.addEventListener("scroll", function(e) {
        Ti.API.info("--scroll start---");
        var itemcnt = e.firstVisibleItem + e.visibleItemCount;
        itemcnt == e.totalItemCount - 2 && (updating || beginUpdate());
        Ti.API.info("--scroll end---");
    });
    $.tvRssList.addEventListener("scrollEnd", function() {
        Ti.API.info("-----tvRssList scrollEnd:");
    });
    $.winRssList.open();
    __defers["$.__views.btnRefresh!click!btnRefresh_click"] && $.__views.btnRefresh.addEventListener("click", btnRefresh_click);
    __defers["$.__views.tvRssList!click!tvRssList_click"] && $.__views.tvRssList.addEventListener("click", tvRssList_click);
    __defers["$.__views.btnTab1!click!btnTab_click"] && $.__views.btnTab1.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab2!click!btnTab_click"] && $.__views.btnTab2.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab3!click!btnTab_click"] && $.__views.btnTab3.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab4!click!btnTab_click"] && $.__views.btnTab4.addEventListener("click", btnTab_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;