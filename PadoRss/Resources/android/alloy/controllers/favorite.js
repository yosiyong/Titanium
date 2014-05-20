function Controller() {
    function SetButton() {
        $.btnTab2.backgroundImage = "/bn_favorite_on.png";
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
    function FavoriteLoad() {
        $.tvFavorite.editing = false;
        GetBookmarks();
    }
    function GetBookmarks() {
        var db = Ti.Database.open("bookmarks");
        db.execute("CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT,parent_id INTEGER,type INTEGER DEFAULT 0,title TEXT,url TEXT,date_added DATETIME DEFAULT CURRENT_TIMESTAMP)");
        var resultSet = db.execute("SELECT id,parent_id,type,title,url FROM bookmarks WHERE type = 1 UNION ALL SELECT id,parent_id,type,title,url FROM bookmarks WHERE type = 0 AND parent_id = 0");
        var image;
        var hasChild;
        var rows = [];
        while (resultSet.isValidRow()) {
            if (0 == resultSet.fieldByName("type")) {
                image = "/bookmark.png";
                hasChild = false;
            } else {
                image = "/folder.png";
                hasChild = true;
            }
            rows.push(Alloy.createController("bm_row", {
                parentId: resultSet.fieldByName("parent_id"),
                title: resultSet.fieldByName("title"),
                type: resultSet.fieldByName("type"),
                url: resultSet.fieldByName("url"),
                image: image,
                hasChild: hasChild,
                rowId: resultSet.fieldByName("id")
            }).getView());
            resultSet.next();
        }
        resultSet.close();
        db.close();
        $.tvFavorite.setData(rows);
    }
    function tvFavorite_click(e) {
        if (0 == e.row.type) {
            var controller = Alloy.createController("webview", {
                title: e.row.Title,
                url: e.row.Url,
                toolbarVisible: false
            });
            var win = controller.getView();
            win.open();
        } else {
            var controller = Alloy.createController("list", {
                parentId: e.row.parentId,
                isView: true,
                isDel: true,
                rowId: e.row.rowId
            });
            var win = controller.getView();
            win.addEventListener("click", function() {});
            win.open({
                animated: true
            });
        }
    }
    function tvFavorite_delete(e) {
        var db = Ti.Database.open("bookmarks");
        1 == e.row.type ? db.execute("DELETE FROM bookmarks WHERE parent_id = ?", e.row.parentId) : db.execute("DELETE FROM bookmarks WHERE id = ?", e.row.rowId);
        db.close();
    }
    function btnTab_click(e) {
        Ti.API.info("::::INDEX::::" + e.source.index);
        switch (e.source.index) {
          case 1:
            var index = Alloy.createController("index").getView();
            index.open();
            break;

          case 2:
            $.btnTab1.backgroundImage = "/bn_newarticle_off.png";
            $.btnTab2.backgroundImage = "/bn_favorite_on.png";
            $.btnTab3.backgroundImage = "/bn_populararticles_off.png";
            $.btnTab4.backgroundImage = "/bn_rss_off.png";
            $.btnMenu.backgroundImage = "/bn_siteselection_off.png";
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
            setTimeout(function() {
                menu.initMenu(true);
            }, 1e3);
            Alloy.Globals.CurrentRss = {
                title: title,
                site: site,
                url: url
            };
            var index = Alloy.createController("index").getView();
            index.open();
        });
        $.winFavorite.add(menu);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "favorite";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winFavorite = Ti.UI.createWindow({
        backgroundColor: "#fff",
        modal: false,
        navBarHidden: true,
        fullscreen: false,
        exitOnClose: true,
        id: "winFavorite"
    });
    $.__views.winFavorite && $.addTopLevelView($.__views.winFavorite);
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
    $.__views.winFavorite.add($.__views.header);
    $.__views.title = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        text: "お気に入り",
        id: "title"
    });
    $.__views.header.add($.__views.title);
    $.__views.tvFavorite = Ti.UI.createTableView({
        top: Alloy.Globals.tableTop,
        bottom: "46dp",
        id: "tvFavorite"
    });
    $.__views.winFavorite.add($.__views.tvFavorite);
    tvFavorite_click ? $.__views.tvFavorite.addEventListener("click", tvFavorite_click) : __defers["$.__views.tvFavorite!click!tvFavorite_click"] = true;
    tvFavorite_delete ? $.__views.tvFavorite.addEventListener("delete", tvFavorite_delete) : __defers["$.__views.tvFavorite!delete!tvFavorite_delete"] = true;
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
    $.__views.winFavorite.add($.__views.footer);
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
    SetMenu();
    FavoriteLoad();
    Titanium.App.addEventListener("foo", function() {
        $.tvFavorite.setData([]);
        FavoriteLoad();
    });
    $.winFavorite.addEventListener("close", function() {
        Titanium.App.removeEventListener("foo");
        $.destroy();
    });
    $.winFavorite.open();
    __defers["$.__views.tvFavorite!click!tvFavorite_click"] && $.__views.tvFavorite.addEventListener("click", tvFavorite_click);
    __defers["$.__views.tvFavorite!delete!tvFavorite_delete"] && $.__views.tvFavorite.addEventListener("delete", tvFavorite_delete);
    __defers["$.__views.btnTab1!click!btnTab_click"] && $.__views.btnTab1.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab2!click!btnTab_click"] && $.__views.btnTab2.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab3!click!btnTab_click"] && $.__views.btnTab3.addEventListener("click", btnTab_click);
    __defers["$.__views.btnTab4!click!btnTab_click"] && $.__views.btnTab4.addEventListener("click", btnTab_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;