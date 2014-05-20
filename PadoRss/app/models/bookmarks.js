var moment = require('alloy/moment');

exports.definition = {
	config: {
		columns: {
		    "id": "integer PRIMARY KEY AUTOINCREMENT",
		    "parent_id": "integer",
		    "type": "integer DEFAULT 0",
		    "title": "text",
		    "url": "text",
		    "date_added": "datetime DEFAULT CURRENT_TIMESTAMP"
		},
		adapter: {
			type: "sql",
			collection_name: "bookmarks"
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
			comparator: function(bookmarks) {
				return bookmarks.get('id');
			}
		});

		return Collection;
	}
};