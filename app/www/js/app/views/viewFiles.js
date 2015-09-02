(function() {

	var dependencies = [
		"jquery", "handlebars", "underscore",
		"backbone", "app/app.templates.hbs"
	];

	function viewFiles($, Handlebars, _, Backbone, templates) {

		return Backbone.View.extend({

			id: "file-view",
			tagName: "div",

			events: {
				"click [data-edit-file-data]": "editFileData",
				"click [data-delete-file]": "deleteFile",
				"click [data-update-file]": "uploadFile"
			},

			editFileData: function(e) {
				this.trigger("edit-file", {
					_id: $(e.target).closest("tr").data("id")});
			},

			deleteFile: function(e) {
				this.trigger("delete-file", {
					_id: $(e.target).closest("tr").data("id")});
			},

			uploadFile: function(e) {
				this.trigger("upload-file", this.collection);
			},


			template: function(collection) {
				return templates["viewFiles"](collection);
			},

			render: function() {
				this.$el.append(this.template(this.collection.toJSON()));
				return this.$el;
			}

		});

	}

	define(dependencies, viewFiles);

})();
