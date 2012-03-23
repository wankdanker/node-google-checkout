var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.cancelOrder('12345', 'Buyer cancelled the order.', 'Buyer ordered another item.', function () {
	console.log(arguments);
});