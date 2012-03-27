var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.shipItems(
	common.googleOrderNumber
	, common.shipItems
	, true
	, function () {
		console.log(arguments);
	}
);
