/*
 * DB(SQLite) connect library
 * Author: Yu Watanabe
 * Version:1.0
 * Last uodate:2012/11/5
 * 
 */

var initTable = {
	table1:"CREATE TABLE IF NOT EXISTS table1 (id INTEGER,username TEXT)",
	//table2:"CREATE TABLE IF NOT EXISTS table2 (〜〜〜〜)",
	
};

exports.db = function(){
	this.db = "";
	this.dbName = "DBname";
	
	/* initialise */
	this.init = function(){
		Ti.API.info("START initialise");
		this.connect();
		this.checkTableExists("table1");
		//this.checkTableExists("table2");
		
		this.close();
		Ti.API.info("FINISH initialise");
	};
	
	/* connect DB */
	this.connect = function(){
		Ti.API.info("connect");
		this.db = Ti.Database.open(this.dbName);
		this.db.execute("BEGIN");
	};
	
	/* close DB */
	this.close = function(){
		Ti.API.info("close");
		this.db.execute("COMMIT");
		this.db.close();
	};
	
	/* check table exists */
	this.checkTableExists = function(_tableName){
		var result = this.db.execute("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = ?",_tableName);
		
		if(result.field(0)){
			Ti.API.info(_tableName + " table is exists");
		}
		else{
			Ti.API.info(_tableName + " table is not exists,create " + _tableName);
			this.db.execute(initTable[_tableName]);
		}
	};
	
	/* console database path */
	this.dbPath = function(){
		Ti.API.info(this.db.file.resolve());
	};
	
	/* delete database */
	this.deleteDB = function(){
		this.connect();
		this.db.remove();
		this.close();
	};
	
	/* query */
	this.query = function(_sql){
		this.connect();
		this.db.execute(_sql);
		var affected = this.db.rowsAffected;
		this.close();
		
		return affected;
	};
	
	/* fetch */
	this.fetch = function(_sql){
		this.connect();
		
		var rows = this.db.execute(_sql);
		var result = {};
		var y = 0;
		while(rows.isValidRow()){
			result[y] = {};
			for(var x = 0,max = rows.getFieldCount();x < max;x++){
				result[y][rows.getFieldName(x)] = rows.field(x);
			}
			y++;
			rows.next();
		}
		rows.close();
		
		this.close();

		return result;
	};
	
	/* constructor */
	this.init();
	
	return this;
};