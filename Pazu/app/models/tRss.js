exports.definition = {
	config: {
		columns: {
		    "id": "integer PRIMARY KEY AUTOINCREMENT",
		    "title": "text",
		    "url": "text",
		    "pubDate": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "tRss"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};