function Controller() {
    function FavoriteLoad() {
        $.tvFavorite.editing = false;
        $.btnEdit.title = "編集";
        GetBookmarks();
    }
    function GetBookmarks() {
        var db = Ti.Database.open("bookmarks");
        Ti.API.info(db.file.getNativePath());
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
            Alloy.Globals.ActiveNav.openWindow(win, {
                animated: true
            });
        } else {
            var controller = Alloy.createController("list", {
                parentId: e.row.parentId,
                isView: true,
                isDel: true,
                rowId: e.row.rowId
            });
            var win = controller.getView();
            win.addEventListener("click", function() {});
            Alloy.Globals.ActiveNav.openWindow(win, {
                animated: true
            });
        }
    }
    function tvFavorite_delete(e) {
        var db = Ti.Database.open("bookmarks");
        1 == e.row.type ? db.execute("DELETE FROM bookmarks WHERE parent_id = ?", e.row.parentId) : db.execute("DELETE FROM bookmarks WHERE id = ?", e.row.rowId);
        db.close();
    }
    function btnEdit_click() {
        if ($.tvFavorite.editing) {
            $.tvFavorite.editing = false;
            $.btnEdit.title = "編集";
        } else {
            $.tvFavorite.editing = true;
            $.btnEdit.title = "完了";
        }
    }
    function tabbedbar_click(e) {
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
            Alloy.Globals.CurrentRss = {
                title: title,
                site: site,
                url: url
            };
            var index = Alloy.createController("index").getView();
            index.open();
        });
        $.winNav.add(menu);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "favorite";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var platFormWidth = Ti.Platform.displayCaps.platformWidth;
    var unitWidth = platFormWidth / 5;
    $.btnTab1.left = "0dp";
    $.btnTab2.left = unitWidth + "dp";
    $.btnTab2.backgroundImage = "/bn_favorite_on.png";
    $.btnTab3.left = 2 * unitWidth + "dp";
    $.btnTab4.left = 3 * unitWidth + "dp";
    $.btnMenu.left = 4 * unitWidth + "dp";
    SetMenu();
    FavoriteLoad();
    $.winNav.open();
    Alloy.Globals.ActiveNav = $.winNav;
    __defers["$.__views.btnEdit!click!btnEdit_click"] && $.__views.btnEdit.addEventListener("click", btnEdit_click);
    __defers["$.__views.tvFavorite!click!tvFavorite_click"] && $.__views.tvFavorite.addEventListener("click", tvFavorite_click);
    __defers["$.__views.tvFavorite!delete!tvFavorite_delete"] && $.__views.tvFavorite.addEventListener("delete", tvFavorite_delete);
    __defers["$.__views.tabbedbar!click!tabbedbar_click"] && $.__views.tabbedbar.addEventListener("click", tabbedbar_click);
    __defers["$.__views.btnMenu!longpress!btnMenu_LongPress"] && $.__views.btnMenu.addEventListener("longpress", btnMenu_LongPress);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;