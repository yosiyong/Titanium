var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.top = 0;

Alloy.Globals.tableTop = "45dp";

try {
    if (true && parseInt(Titanium.Platform.version.split(".")[0], 10) >= 7) {
        Ti.API.info("iOS7:" + Titanium.Platform.version);
        Alloy.Globals.top = "20dp";
        Alloy.Globals.tableTop = "65dp";
    }
} catch (e) {}

if (false === Titanium.Network.online) {
    var dialog = Ti.UI.createAlertDialog({
        title: "ネットワーク接続できていません"
    });
    dialog.show();
}

Alloy.Globals.EnableRss = true;

Alloy.Globals.Rss = {
    rss1: {
        title: "パズドラ",
        site: "pad-plus.com"
    },
    rss2: {
        title: "ガンパズ",
        site: "gunpaz.pad-plus.com"
    },
    rss3: {
        title: "ディバゲ",
        site: "dg.pad-plus.com"
    },
    rss4: {
        title: "クラクラ",
        site: "coc.pad-plus.com"
    },
    rss5: {
        title: "ワンフリ",
        site: "wf.pad-plus.com"
    }
};

Alloy.Globals.CurrentRss = {
    title: "パズドラ",
    site: "pad-plus.com",
    url: "http://pad-plus.com/feed"
};

Alloy.createController("index");