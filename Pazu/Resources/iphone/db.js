var initTable = {
    table1: "CREATE TABLE IF NOT EXISTS table1 (id INTEGER,username TEXT)"
};

exports.db = function() {
    this.db = "";
    this.dbName = "DBname";
    this.init = function() {
        Ti.API.info("START initialise");
        this.connect();
        this.checkTableExists("table1");
        this.close();
        Ti.API.info("FINISH initialise");
    };
    this.connect = function() {
        Ti.API.info("connect");
        this.db = Ti.Database.open(this.dbName);
        this.db.execute("BEGIN");
    };
    this.close = function() {
        Ti.API.info("close");
        this.db.execute("COMMIT");
        this.db.close();
    };
    this.checkTableExists = function(_tableName) {
        var result = this.db.execute("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = ?", _tableName);
        if (result.field(0)) Ti.API.info(_tableName + " table is exists"); else {
            Ti.API.info(_tableName + " table is not exists,create " + _tableName);
            this.db.execute(initTable[_tableName]);
        }
    };
    this.dbPath = function() {
        Ti.API.info(this.db.file.resolve());
    };
    this.deleteDB = function() {
        this.connect();
        this.db.remove();
        this.close();
    };
    this.query = function(_sql) {
        this.connect();
        this.db.execute(_sql);
        var affected = this.db.rowsAffected;
        this.close();
        return affected;
    };
    this.fetch = function(_sql) {
        this.connect();
        var rows = this.db.execute(_sql);
        var result = {};
        var y = 0;
        while (rows.isValidRow()) {
            result[y] = {};
            for (var x = 0, max = rows.getFieldCount(); max > x; x++) result[y][rows.getFieldName(x)] = rows.field(x);
            y++;
            rows.next();
        }
        rows.close();
        this.close();
        return result;
    };
    this.init();
    return this;
};