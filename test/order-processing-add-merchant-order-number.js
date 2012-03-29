var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.addMerchantOrderNumber(
	common.googleOrderNumber
	,common.merchantOrderNumber
	, function (err, xml) {
		console.log(xml);
	}
	, true
);