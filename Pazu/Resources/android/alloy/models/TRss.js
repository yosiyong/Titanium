exports.definition = {
    config: {
        columns: {
            id: "integer PRIMARY KEY AUTOINCREMENT",
            title: "text",
            url: "text",
            pubDate: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "tRss"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("tRss", exports.definition, []);

collection = Alloy.C("tRss", exports.definition, model);

exports.Model = model;

exports.Collection = collection;