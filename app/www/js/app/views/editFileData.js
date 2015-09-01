(function() {

	var dependencies = [
		"jquery", "handlebars", "underscore",
		"backbone", "app/app.templates.hbs"
	];

	function editFileData($, Handlebars, _, Backbone, templates) {

		return Backbone.View.extend({

			id: "File-edit",
			tagName: "div",

			events: {
				"click [data-save-fileData]": "saveFileData",
				"click [data-view-Files]": "listFiles"
			},

			saveFileData: function() {
				this.trigger("save-file-data", {
					_id: this.model.id,
					name: $("#name").val(),
					description: $("#description").val()
				});
			},

			listFiles: function() {
				this.trigger("list-files", this.model);
			},

			template: function(model) {
				return templates["editFileData"](model);
			},

			render: function() {
				this.$el.append(this.template(this.model.toJSON()));
				return this.$el;
			}

		});

	}

	define(dependencies, editFileData);

})();
