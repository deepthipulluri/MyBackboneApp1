(function() {

	var dependencies = [
		"jquery", "handlebars", "underscore",
		"backbone", "app/app.templates.hbs"
	];

	function viewAccount($, Handlebars, _, Backbone, templates) {

		return Backbone.View.extend({

			id: "account-view",
			tagName: "div",

			events: {
				"click [data-edit-file-data]": "editFileData",
				"click [data-delete-file]": "deleteFile"
			},

			editFileData: function() {
				this.trigger("edit-file-data", this.model);
			},

			deleteFile: function() {
				this.trigger("delete-file", this.model);
			},

			render: function() {
				this.$el.append(this.template(this.model.toJSON()));
				return this.$el;
			}

		});

	}

	define(dependencies, viewAccount);

})();
