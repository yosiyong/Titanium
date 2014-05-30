function Controller() {
    function isiOS7Plus() {
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0], 10);
        if (major >= 7) return true;
        return false;
    }
    function RssListLoad() {
        if (true === Alloy.Globals.EnableRss) {
            lastDistance = 0;
            lastRow = 20;
            updating = false;
            baseActInd.show();
            Refresh();
        }
    }
    function beginUpdate() {
        updating = true;
        baseActInd.show();
        ActivityIndicatorStyle && (rowActInd.style = isIOS7 ? ActivityIndicatorStyle.DARK : ActivityIndicatorStyle.PLAIN);
        rowActInd.message = "Loading...";
        loadingRow.add(rowActInd);
        rowActInd.show();
        $.tvRssList.appendRow(loadingRow);
        Ti.API.info("ADD LOAD ROW:" + lastRow);
        setTimeout(endUpdate, 2e3);
    }
    function endUpdate() {
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
        baseActInd.hide();
        rowActInd.hide();
    }
    function SetRssList() {
        var db = Ti.Database.open("tRss");
        Ti.API.info("-----SetRssList tRss:" + db.file.getNativePath());
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
    }
    function Refresh() {
        if (false == Titanium.Network.online) {
            var dialog = Ti.UI.createAlertDialog({
                title: "ネットワーク接続できていません"
            });
            dialog.show();
            return;
        }
        $.btnRefresh.enabled = false;
        Titanium.App.removeEventListener("EndLinks", CallEndLinks);
        var db = Ti.Database.open("tRss");
        Ti.API.info("~~~refresh tRSS DB :" + db.file.getNativePath());
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
        Refresh();
    }
    function tvRssList_click(e) {
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
            _rssList = [];
            baseActInd.show();
            var rows = [];
            $.tvRssList.setData(rows);
            Refresh();
        });
        $.winNav.add(menu);
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
        fullscreen: false,
        navBarHidden: true,
        exitOnClose: true,
        id: "winRssList"
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
    $.__views.winRssList.add($.__views.header);
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
        window: $.__views.winRssList,
        id: "winNav"
    });
    $.__views.winNav && $.addTopLevelView($.__views.winNav);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var platFormWidth = Ti.Platform.displayCaps.platformWidth;
    var unitWidth = platFormWidth / 5;
    $.btnTab1.left = "0dp";
    $.btnTab2.left = unitWidth + "dp";
    $.btnTab3.left = 2 * unitWidth + "dp";
    $.btnTab4.left = 3 * unitWidth + "dp";
    $.btnMenu.left = 4 * unitWidth + "dp";
    $.btnTab4.backgroundImage = "/bn_rss_on.png";
    var isIOS7 = isiOS7Plus();
    true && Alloy.isTablet;
    var osname = Ti.Platform.osname;
    var isIos = "iphone" === osname || "ipad" === osname;
    var isAndroid = "android" === osname;
    var ad = require("net.nend");
    var adView;
    adView = isAndroid ? ad.createView({
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
    $.winRssList.add(adView);
    var ActivityIndicatorStyle;
    isIos ? ActivityIndicatorStyle = Titanium.UI.iPhone.ActivityIndicatorStyle : sdkVersion >= 3 && (ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle);
    var baseActInd = Titanium.UI.createActivityIndicator({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    ActivityIndicatorStyle && (baseActInd.style = isIOS7 ? ActivityIndicatorStyle.DARK : ActivityIndicatorStyle.PLAIN);
    $.winRssList.add(baseActInd);
    SetMenu();
    var rss = require("rss");
    var _rssList = [];
    var lastDistance = 0;
    var lastRow = 20;
    var updating = false;
    var loadingRow = Ti.UI.createTableViewRow();
    var rowActInd = Ti.UI.createActivityIndicator({
        left: 100,
        height: 50,
        width: 10
    });
    CallEndLinks = function(e) {
        Ti.API.info("★EndLinks:[" + e.param1 + "](" + e.param2 + ")");
        Ti.API.info("CallEndLinks:画面表示処理");
        Titanium.App.removeEventListener("EndLinks", CallEndLinks);
        SetRssList();
        Alloy.Globals.EnableRss = false;
        $.btnRefresh.enabled = true;
        baseActInd.hide();
    };
    RssListLoad();
    $.winNav.addEventListener("blur", function() {
        Ti.API.info("winNav blur");
        Alloy.Globals.EnableRss = true;
        Titanium.App.removeEventListener("EndLinks", CallEndLinks);
    });
    $.tvRssList.addEventListener("scroll", function(e) {
        var offset = e.contentOffset.y;
        var height = e.size.height;
        var total = offset + height;
        var theEnd = e.contentSize.height;
        var distance = theEnd - total;
        if (lastDistance > distance) {
            var nearEnd = .75 * theEnd;
            !updating && total >= nearEnd && beginUpdate();
        }
        lastDistance = distance;
    });
    $.winNav.open();
    Alloy.Globals.ActiveNav = $.winNav;
    __defers["$.__views.btnRefresh!click!btnRefresh_click"] && $.__views.btnRefresh.addEventListener("click", btnRefresh_click);
    __defers["$.__views.tvRssList!click!tvRssList_click"] && $.__views.tvRssList.addEventListener("click", tvRssList_click);
    __defers["$.__views.tabbedbar!click!tabbedbar_click"] && $.__views.tabbedbar.addEventListener("click", tabbedbar_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;