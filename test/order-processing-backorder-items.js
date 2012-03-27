var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.backorderItems(
	common.googleOrderNumber
	, common.backorderItems
	, true
	, function () {
		console.log(arguments);
	}
);
