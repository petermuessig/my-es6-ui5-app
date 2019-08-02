sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("my.ui5app.controller.Main", {
		demoFunction:async function(oEvent){
			console.log("just adding async will block the defined resources in the manifest from loading...")
		}
	});
});