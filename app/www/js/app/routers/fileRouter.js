(function() {

	var dependencies = ["jquery", "underscore", "backbone"];

	function fileRouter($, _, Backbone) {

		return Backbone.Router.extend({
			routes: {
				"files(/)":"listFiles",
				"files/(:id/)edit": "editFile",
			},

			listFiles: function() {
				this.trigger("list-files");
			},
			
			editFile: function(id) {
				this.trigger("edit-file", id);
			}
			
		});

	}

	define(dependencies, fileRouter);

})();
