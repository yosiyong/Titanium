var moment = require("alloy/moment");

var RSS_URL = Alloy.Globals.CurrentRss.url;

var _url = Alloy.Globals.CurrentRss.url;

var _urlIndex = 0;

var MONTH_MAP = {
    JAN: 1,
    FEB: 2,
    MAR: 3,
    APR: 4,
    MAY: 5,
    JUN: 6,
    JUL: 7,
    AUG: 8,
    SEP: 9,
    OCT: 10,
    NOV: 11,
    DEC: 12
};

var getRssText = function(item, key) {
    return null == item.getElementsByTagName(key).item(0) ? "pubDate" == key ? getRssText(item, "dc:date") : "" : item.getElementsByTagName(key).item(0).text;
};

var getLocalDate = function(dateString) {
    var timeParts;
    var dateParts = dateString.split(" ");
    timeParts = dateParts[4].split(":");
    return String.format("%04.0f-%02.0f-%02.0f %02.0f:%02.0f", Number(dateParts[3]), Number(MONTH_MAP[dateParts[1].toUpperCase()]), Number(dateParts[2]), Number(timeParts[0]), Number(timeParts[1]));
};

var parseDate = function(dateString) {
    if ("" == dateString) return "";
    var dateParts = dateString.split(" ");
    if (6 > dateParts.length) {
        var sdate;
        parts = dateString.split("T");
        sdate = 1 === parts.length && 2 === dateParts.length ? moment(dateString, "YYYY-MM-DDTHH:mm:ssZ") : moment(dateString);
        return getLocalDate(sdate.toString());
    }
    sdate = moment(dateString);
    return getLocalDate(sdate.toString());
};

exports.setUrl = function(value) {
    _url = value;
};

exports.setUrlIndex = function(value) {
    _urlIndex = value;
};

exports.getUrlIndex = function() {
    return _urlIndex;
};

exports.loadRssFeedDb = function(o, tries) {
    var xhr = Titanium.Network.createHTTPClient();
    tries = tries || 0;
    xhr.open("GET", _url);
    xhr.setRequestHeader("User-Agent", "PadoRssAgent");
    xhr.timeout = 5e3;
    xhr.onload = function() {
        try {
            var xml = this.responseXML;
            if (null === xml || null === xml.documentElement) {
                if (3 > tries) {
                    tries++;
                    exports.loadRssFeedDb(o, tries);
                    return;
                }
                alert("Error reading RSS feed. Make sure you have a network connection and try refreshing.");
                o.error && o.error();
                return;
            }
            var items = xml.documentElement.getElementsByTagName("item");
            var data = [];
            var db = Ti.Database.open("tRss");
            db.execute("CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)");
            var title, link, pubDate;
            for (var i = 0; items.length > i; i++) {
                var item = items.item(i);
                title = getRssText(item, "title");
                link = getRssText(item, "link");
                pubDate = parseDate(getRssText(item, "pubDate"));
                data.push({
                    title: title,
                    link: link,
                    pubDate: pubDate
                });
                db.execute("INSERT INTO tRss (title,url,pubDate) VALUES (?,?,?)", title, link, pubDate);
                Ti.API.info("(" + _urlIndex + ")[" + _url + "]" + title + " : " + link + " : " + pubDate);
            }
            db.close();
            if (o.success) {
                o.success(data);
                Ti.App.fireEvent("EndLinks", {
                    param1: _url,
                    param2: _urlIndex
                });
            }
        } catch (err) {
            Ti.API.info("★★★★loadRssFeedDb:ERROR★★★★★：" + err);
            o.error();
        }
    };
    xhr.onerror = function() {
        o.error && o.error();
    };
    o.start && o.start();
    xhr.send();
};

exports.loadRssFeed = function(o, tries) {
    RSS_URL = Alloy.Globals.CurrentRss.url;
    var xhr = Titanium.Network.createHTTPClient();
    tries = tries || 0;
    xhr.open("GET", RSS_URL);
    xhr.setRequestHeader("User-Agent", "PadoRssAgent");
    xhr.onload = function() {
        try {
            var xml = this.responseXML;
            if (null === xml || null === xml.documentElement) {
                if (3 > tries) {
                    tries++;
                    exports.loadRssFeed(o, tries);
                    return;
                }
                alert("Error reading RSS feed. Make sure you have a network connection and try refreshing.");
                o.error && o.error();
                return;
            }
            var items = xml.documentElement.getElementsByTagName("item");
            var data = [];
            for (var i = 0; items.length > i; i++) {
                var item = items.item(i);
                data.push({
                    title: getRssText(item, "title"),
                    link: getRssText(item, "link"),
                    pubDate: parseDate(getRssText(item, "pubDate"))
                });
            }
            o.success && o.success(data);
        } catch (err) {
            Ti.API.info("★★★★loadRssFeedERROR★★★★★：" + err);
            o.error();
        }
    };
    xhr.onerror = function() {
        o.error && o.error();
    };
    o.start && o.start();
    xhr.send();
};