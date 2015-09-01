(function() {

	var dependencies = [
		"jquery", "underscore",
		"backbone","app/controllers/fileController","app/controllers/appController",
		 "app/routers/accountRouter","app/routers/fileRouter"
	];

	function app($, _, Backbone, FileController,AppController,AccountRouter, FileRouter ) {


		var accountRouter = new AccountRouter();
		var fileRouter = new FileRouter();

		var appController = new AppController(accountRouter);
		//appController.start("55e48de10ea7f36020d38989");
		var fileController = new FileController(fileRouter);
		//fileController.start();
		Backbone.history.start({pushState: true});
	}

	define(dependencies, app);

})();
