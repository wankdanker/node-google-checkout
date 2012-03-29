var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.sendBuyerMessage(
	common.googleOrderNumber
	,'Your order will ship tomorrow.'
	, true
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
