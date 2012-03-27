var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.cancelOrder(
	common.googleOrderNumber, 
	'Buyer cancelled the order.', 
	'Buyer ordered another item.'
	, function () {
		console.log(arguments);
	}
);