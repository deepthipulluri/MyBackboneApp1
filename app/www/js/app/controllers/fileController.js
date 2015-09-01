define(["underscore", "backbone", "app/collections/userFiles","app/models/userFile",
				"app/views/viewFiles", "app/views/editFileData"],
	function(_, Backbone, UserFiles, UserFileModel, ViewFiles,EditFileData) {

		return function(router) {

			_.extend(this, Backbone.Events);

			var currentView = null;
			var controller = this;
			var accountId = "55df5ab99e05ba9d751f6c4e";

			function fetchFiles(cb){
				console.log("here");
				var files = new UserFiles();
				files.fetch({
					success: function(collection,response,options){
							cb(collection);
					}
				});

			}

			function fetchFile(cb, fileId){
				var files = new UserFileModel(fileId);
				console.log(fileId);
				files.fetch({
					success: function(model,response,options){
							console.log("here" ,response);
							cb(model);
					}
				});

			}

			controller.listenTo(router, "list-files", function() {
				fetchFiles(controller.listFiles);
			});

			controller.listenTo(router, "edit-file", function(fileId) {
				console.log("edit File data");
				fetchFile(controller.editFileData,fileId);
			});




			this.listFiles = function(collection) {
				console.log("list Files");
				if (currentView) {
					currentView.remove();
				}

				currentView = new ViewFiles({
					collection: collection
				});		
				console.log(collection);		

				controller.listenTo(currentView, "edit-file", function(fileId) {
					fetchFile(this.editFileData,fileId);
				});

				controller.listenTo(currentView, "delete-file", function(fileId) {
					fetchFile(this.deleteFileData,fileId);
				});				

				$("#app").append(currentView.render());
				router.navigate("/files/");
			};

			this.editFileData = function(model) {

				if (currentView) {
					currentView.remove();
				}

				currentView = new EditFileData({
					model: model
				});

				controller.listenTo(currentView, "save-file-data", function(accountAttributes) {
					console.log("controller");
					this.saveFileData(accountAttributes);
				});

				controller.listenTo(router, "list-files", function() {
					fetchFiles(controller.listFiles);
				});

				$("#app").append(currentView.render());

				router.navigate("/files/" +
					encodeURIComponent(model.id) + "/edit");
			}
			
			this.saveFileData = function(File) {
				var userFile = new UserFileModel(File);

				userFile.save(null, {
					success: function(model, response, options) {
						router.trigger("list-files");
					},
					error: function(model, response, options) {
						console.log("account not saved");
					}
				});
			};

			this.deleteFileData = function(File) {
				var userFile = new UserFileModel(File);

				userFile.save(null, {
					success: function(model, response, options) {
						router.trigger("list-files");
					},
					error: function(model, response, options) {
						console.log("account not saved");
					}
				});
			};
			this.start = function() {
				console.log("start");
				this.listFiles();

			};

		};


	});
