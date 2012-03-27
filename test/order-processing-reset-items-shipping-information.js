var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.resetItemsShippingInformation(
	common.googleOrderNumber
	, common.resetItems
	, true
	, function () {
		console.log(arguments);
	}
);
