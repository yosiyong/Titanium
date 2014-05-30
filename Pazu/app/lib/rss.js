var moment = require('alloy/moment');
var RSS_URL = OS_MOBILEWEB ? '/feed.xml' : Alloy.Globals.CurrentRss.url;
var _url = Alloy.Globals.CurrentRss.url;
var _urlIndex = 0;
var MONTH_MAP = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

var getRssText = function(item, key) {
	
	if (item.getElementsByTagName(key).item(0)== null){
		if (key == "pubDate") {
			return getRssText(item, 'dc:date');
		}else{
			return "";
		}
	}else{
		
		return OS_MOBILEWEB ?
					item.getElementsByTagName(key).item(0).textContent : //childNodes[0].nodeValue :
					item.getElementsByTagName(key).item(0).text;
				
	}

};


var getLocalDate = function(dateString) {
	//Fri Mar 28 2014 19:35:04 GMT+0900
	var timeParts;
	var dateParts = dateString.split(' ');
	timeParts = dateParts[4].split(':');
	return String.format("%04.0f-%02.0f-%02.0f %02.0f:%02.0f", Number(dateParts[3]), Number(MONTH_MAP[dateParts[1].toUpperCase()]), Number(dateParts[2]), Number(timeParts[0]), Number(timeParts[1]));
};

var parseDate = function(dateString) {
	if (dateString == ""){
		return "";
	}
	
	var timeParts;
	var dateParts = dateString.split(' ');
	
	//Ti.API.info(dateString + "[" + dateParts.length + "]");
	
	if (dateParts.length < 6){
		var sdate;
		parts = dateString.split('T');
		
		if (parts.length === 1 && dateParts.length === 2){
			//2013-12-15 23:45:00
			//sdate = dateParts[0].split('-');
			//timeParts = dateParts[1].split(':');
			
			sdate = moment(dateString,"YYYY-MM-DDTHH:mm:ssZ");
		}else{
			//2013-12-16T22:27:36+09:00
			//sdate = parts[0].split('-');
			//timeParts = parts[1].split(':');
			
			sdate = moment(dateString);
		}
		
		//Ti.API.info(dateString + "[" + sdate[1] + "]" + Number(sdate[1]));
		//return String.format("%04.0f-%02.0f-%02.0f %02.0f:%02.0f", Number(sdate[0]), Number(sdate[1]), Number(sdate[2]), Number(timeParts[0]), parseInt(timeParts[1]));
		
		return getLocalDate(sdate.toString());
	}else{
		//Mon, 16 Dec 2013 23:20:48 +0900
		
		//timeParts = dateParts[4].split(':');
		//return String.format("%04.0f-%02.0f-%02.0f %02.0f:%02.0f", Number(dateParts[3]), Number(MONTH_MAP[dateParts[2].toUpperCase()]), Number(dateParts[1]), Number(timeParts[0]), Number(timeParts[1]));
		sdate = moment(dateString);
		return getLocalDate(sdate.toString());
	}
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
	xhr.open('GET', _url);
	xhr.setRequestHeader('User-Agent', 'PadoRssAgent');
	xhr.timeout= 5000;
	xhr.onload = function(e) {
		
		try{
			var xml = this.responseXML;
	
			if (xml === null || xml.documentElement === null) {
				if (tries < 3) {
					tries++;
					exports.loadRssFeedDb(o, tries);
					return;
				} else {
					alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
					if (o.error) { o.error(); }
					return;
				}
			}
	
			var items = xml.documentElement.getElementsByTagName("item");
			var data = [];
	
			var db = Ti.Database.open('tRss');
			//alert(db.file.getNativePath());
			db.execute('CREATE TABLE IF NOT EXISTS tRss (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,url TEXT,pubDate TEXT)');
			var title,link,pubDate;
			
			for (var i = 0; i < items.length; i++) {
				var item = items.item(i);
				title = getRssText(item, 'title');
				link = getRssText(item, 'link');
				pubDate = parseDate(getRssText(item, 'pubDate'));
				data.push({
					title: title,
					link: link,
					pubDate: pubDate
				});
				db.execute('INSERT INTO tRss (title,url,pubDate) VALUES (?,?,?)',title,link,pubDate);
				Ti.API.info("(" + _urlIndex +")[" + _url + "]" + title + " : " + link + " : " + pubDate);
			}
			db.close();
			
			if (o.success) { 
				o.success(data);
			
				Ti.App.fireEvent("EndLinks", {
				  param1: _url,
				  param2: _urlIndex
				});
			}
		
		}catch(err){
            // ...
            Ti.API.info("★★★★loadRssFeedDb:ERROR★★★★★：" + err);
            o.error();
        }
	};
	xhr.onerror = function(e) {
		if (o.error) { o.error(); }
	};

	if (o.start) { o.start(); }
	xhr.send();
	
	
};

exports.loadRssFeed = function(o, tries) {
	RSS_URL = Alloy.Globals.CurrentRss.url;
	var xhr = Titanium.Network.createHTTPClient();
	tries = tries || 0;
	xhr.open('GET', RSS_URL);
	xhr.setRequestHeader('User-Agent', 'PadoRssAgent');
	xhr.onload = function(e) {
		try{
			var xml = this.responseXML;
	
			if (xml === null || xml.documentElement === null) {
				if (tries < 3) {
					tries++;
					exports.loadRssFeed(o, tries);
					return;
				} else {
					alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
					if (o.error) { o.error(); }
					return;
				}
			}
	
			var items = xml.documentElement.getElementsByTagName("item");
			var data = [];
	
			for (var i = 0; i < items.length; i++) {
				var item = items.item(i);
				/*
				var image;
				try {
					var elems = item.getElementsByTagNameNS('http://mashable.com/', 'thumbnail');
					image = elems.item(0).getElementsByTagName('img').item(0).getAttribute('src');
				} catch (ex) {
					image = '';
				}
				*/
	
				data.push({
					title: getRssText(item, 'title'),
					link: getRssText(item, 'link'),
					pubDate: parseDate(getRssText(item, 'pubDate'))
				});
			}
			if (o.success) { o.success(data); }
		 }catch(err){
            // ...
            Ti.API.info("★★★★loadRssFeedERROR★★★★★：" + err);
            o.error();
        }
	};
	xhr.onerror = function(e) {
		if (o.error) { o.error(); }
	};

	if (o.start) { o.start(); }
	xhr.send();
};