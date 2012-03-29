var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.shipItems(
	common.googleOrderNumber
	, common.shipItems
	, true
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
