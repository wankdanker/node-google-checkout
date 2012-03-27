var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.authorizeOrder(
	common.googleOrderNumber
	, function () {
		console.log(arguments);
	}
);