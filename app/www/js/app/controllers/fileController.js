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
				console.log("file"+fileId);
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
				fetchFile(controller.editFileData,fileId);
			});

			controller.listenTo(router, "upload-file", function(fileInput) {
				console.log("fileInput");
				controller.uploadFile(fileInput);
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


				controller.listenTo(currentView, "upload-file", function(collection) {
					controller.uploadFile(collection);
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
				console.dir(File);
				
				userFile.destroy({
					success: function(model, response, options) {
						  var xhr = new XMLHttpRequest();
			                xhr.addEventListener("readystatechange", function(){
			                    if(xhr.readyState === 4 && xhr.status === 200){
			                       router.trigger("list-files");
			                    }    	
			                });

			                xhr.open("DELETE","/api/upload/" + userFile.name);
			                xhr.send();
					},
					error: function(model, response, options) {
						console.log("file not deleted");
					}
				});
				
			};

			this.uploadFile = function(collection) {
				
				var fileInput= document.getElementById("upload-file");
                var fd = new FormData();
                for(var x=0; x< fileInput.files.length; x++){
                    fd.append("upload-file", fileInput.files[x], fileInput.files[x].filename);

                }
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("readystatechange", function(){
                    if(xhr.readyState === 4 && xhr.status === 200){
                        var obj = jQuery.parseJSON(xhr.responseText);
                        var userFile = new UserFileModel({
                        	name: obj.filename,
							sizeinBytes: obj.size,
							uploaded: obj.uploadDate,
							description: obj.description
                        });
                        userFile.save(null, {
                        	success: function(model,response,options){
                        		collection.push(userFile);
                        		controller.listFiles(collection);
                        	}
                        })
                    }
                });

                        //wire up on ready state change 

                xhr.open("POST","/api/upload");
                xhr.send(fd);

				
            }

			this.start = function() {
				console.log("start");
				this.listFiles();

			};

		};

	});
