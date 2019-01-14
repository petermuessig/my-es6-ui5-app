sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"./Foo",
	"./Bar"
], function (JSONModel, Device, Foo, Bar) {
	"use strict";

	return {

		createDeviceModel() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createFooBarModel() {
			var oModel = new JSONModel({
				foo: new Foo("Hello Foo").prototypeMethod(),
				bar: new Foo("Hello Bar").prototypeMethod()
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};

});