var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.addMerchantOrderNumber('12345','39803489', function () {
	console.log(arguments);
});