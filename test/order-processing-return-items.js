var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.returnItems(
	common.googleOrderNumber
	, common.returnItems
	, true
	, function () {
		console.log(arguments);
	}
);
