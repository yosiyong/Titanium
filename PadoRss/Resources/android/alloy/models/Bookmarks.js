var moment = require("alloy/moment");

exports.definition = {
    config: {
        columns: {
            id: "integer PRIMARY KEY AUTOINCREMENT",
            parent_id: "integer",
            type: "integer DEFAULT 0",
            title: "text",
            url: "text",
            date_added: "datetime DEFAULT CURRENT_TIMESTAMP"
        },
        adapter: {
            type: "sql",
            collection_name: "bookmarks"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            comparator: function(bookmarks) {
                return bookmarks.get("id");
            }
        });
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("bookmarks", exports.definition, []);

collection = Alloy.C("bookmarks", exports.definition, model);

exports.Model = model;

exports.Collection = collection;