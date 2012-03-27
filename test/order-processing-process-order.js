var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.processOrder(
	common.googleOrderNumber
	, function () {
		console.log(arguments);
	}
);
