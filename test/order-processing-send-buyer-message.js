var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.sendBuyerMessage(
	common.googleOrderNumber
	,'Your order will ship tomorrow.'
	, true
	, function () {
		console.log(arguments);
	}
);
