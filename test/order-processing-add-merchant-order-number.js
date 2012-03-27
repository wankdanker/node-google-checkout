var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.addMerchantOrderNumber(
	common.googleOrderNumber
	,common.merchantOrderNumber
	, function () {
		console.log(arguments);
	}
);